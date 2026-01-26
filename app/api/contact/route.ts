import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas/contact";
import { ZodError } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (5 messages per hour)
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 hour
    });
    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de messages envoyés. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Send email via Resend
    const { data: emailData, error } = await resend.emails.send({
      from: "InnovateBF <onboarding@resend.dev>", // Use resend.dev domain for testing
      to: [process.env.CONTACT_EMAIL || "contact@innovatebf.org"],
      replyTo: data.email,
      subject: `[Contact InnovateBF] ${data.subject}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${data.name}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Sujet :</strong> ${data.subject}</p>
        <hr />
        <h3>Message :</h3>
        <p>${data.message.replace(/\n/g, "<br />")}</p>
        <hr />
        <p><small>Ce message a été envoyé via le formulaire de contact du site InnovateBF.</small></p>
      `,
      text: `
Nouveau message de contact

Nom : ${data.name}
Email : ${data.email}
Sujet : ${data.subject}

Message :
${data.message}

---
Ce message a été envoyé via le formulaire de contact du site InnovateBF.
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi du message" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: emailData?.id },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
