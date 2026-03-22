import { NextRequest, NextResponse } from "next/server";
import { getComments, postComment, castVote } from "@/lib/innovons/forum-queries";
import { requireRoleForApi } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const needId = searchParams.get("needId");
  if (!needId) return NextResponse.json({ error: "needId required" }, { status: 400 });
  const comments = await getComments(needId);
  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest) {
  // RBAC: any authenticated user (guest+) can post comments/votes
  const auth = await requireRoleForApi('guest');
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const { type, needId, parentId, authorName, authorEmail, content, value, userEmail } = body;

    if (type === "vote") {
      if (!needId || !userEmail || !value) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      const result = await castVote(needId, userEmail, value as 1 | -1);
      return NextResponse.json(result);
    }

    // type === "comment"
    if (!needId || !authorName || !authorEmail || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (content.length < 10 || content.length > 2000) {
      return NextResponse.json({ error: "Content must be 10-2000 characters" }, { status: 400 });
    }
    const comment = await postComment({ needId, parentId, authorName, authorEmail, content });
    return NextResponse.json({ comment }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/innovons/forum]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
