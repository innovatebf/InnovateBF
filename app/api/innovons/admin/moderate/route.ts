import { NextRequest, NextResponse } from "next/server";
import { submitModerationAction } from "@/lib/innovons/admin-queries";
import {
  sendNeedApprovedEmail,
  sendNeedRejectedEmail,
  sendRevisionRequestedEmail,
} from "@/lib/innovons/email";

interface ModerationRequestBody {
  needId: string;
  action: "APPROVED" | "REVISION_REQUESTED" | "REJECTED";
  comment: string;
  sendEmail: boolean;
  authorEmail: string;
  authorName: string;
  needTitle: string;
  needSlug: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ModerationRequestBody;
    const {
      needId,
      action,
      comment,
      sendEmail,
      authorEmail,
      authorName,
      needTitle,
      needSlug,
    } = body;

    if (!needId || !action || !comment) {
      return NextResponse.json(
        { error: "Parametres manquants" },
        { status: 400 },
      );
    }

    const validActions: readonly string[] = ["APPROVED", "REVISION_REQUESTED", "REJECTED"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: "Action non valide" },
        { status: 400 },
      );
    }

    if (comment.trim().length < 20) {
      return NextResponse.json(
        { error: "Le commentaire doit contenir au moins 20 caracteres" },
        { status: 400 },
      );
    }

    // Soumettre l'action de moderation
    const result = await submitModerationAction({ needId, action, comment });
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 },
      );
    }

    // Envoyer email si demande
    if (sendEmail && authorEmail) {
      try {
        if (action === "APPROVED") {
          await sendNeedApprovedEmail({
            to: authorEmail,
            authorName,
            needTitle,
            needSlug,
          });
        } else if (action === "REJECTED") {
          await sendNeedRejectedEmail({
            to: authorEmail,
            authorName,
            needTitle,
            comment,
          });
        } else if (action === "REVISION_REQUESTED") {
          await sendRevisionRequestedEmail({
            to: authorEmail,
            authorName,
            needTitle,
            needId,
            comment,
          });
        }
      } catch (emailError) {
        // Log but don't fail the request if email fails
        console.error("[Admin Moderate API] Email sending failed:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[Admin Moderate API]", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 },
    );
  }
}
