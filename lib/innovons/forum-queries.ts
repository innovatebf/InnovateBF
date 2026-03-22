import { getSql } from "@/lib/db/neon";

function isNeonConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("your-")
  );
}

// Types
export interface Comment {
  id: string;
  need_id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
  replies?: Comment[];
}

export interface VoteResult {
  vote_score: number;
  vote_count: number;
  user_vote: -1 | 0 | 1;
}

// Mock data
const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    need_id: "need-1",
    parent_id: null,
    author_name: "Amadou Traore",
    author_email: "amadou@example.com",
    content: "Ce besoin est crucial pour notre region. Nous avons deja commence des initiatives similaires a Koudougou.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    replies: [
      {
        id: "c2",
        need_id: "need-1",
        parent_id: "c1",
        author_name: "Fatima Ouedraogo",
        author_email: "fatima@example.com",
        content: "Excellente initiative ! Pouvez-vous partager plus de details sur votre approche ?",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
  {
    id: "c3",
    need_id: "need-1",
    parent_id: null,
    author_name: "Ibrahim Kabore",
    author_email: "ibrahim@example.com",
    content: "Il faudrait aussi considerer l'aspect formation des techniciens locaux pour la maintenance.",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    replies: []
  }
];

export async function getComments(needId: string): Promise<Comment[]> {
  if (!isNeonConfigured()) {
    return MOCK_COMMENTS.map(c => ({ ...c, need_id: needId }));
  }
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT id, need_id, parent_id, author_name, author_email, content, created_at
      FROM ie_comments
      WHERE need_id = ${needId} AND parent_id IS NULL
      ORDER BY created_at DESC
    ` as Comment[];
    // Fetch replies
    for (const comment of rows) {
      const replies = await sql`
        SELECT id, need_id, parent_id, author_name, author_email, content, created_at
        FROM ie_comments
        WHERE parent_id = ${comment.id}
        ORDER BY created_at ASC
      ` as Comment[];
      comment.replies = replies;
    }
    return rows;
  } catch (err) {
    console.error("[getComments]", err);
    return MOCK_COMMENTS.map(c => ({ ...c, need_id: needId }));
  }
}

export async function postComment(data: {
  needId: string;
  parentId?: string;
  authorName: string;
  authorEmail: string;
  content: string;
}): Promise<Comment | null> {
  if (!isNeonConfigured()) {
    const mock: Comment = {
      id: "mock-" + Date.now(),
      need_id: data.needId,
      parent_id: data.parentId ?? null,
      author_name: data.authorName,
      author_email: data.authorEmail,
      content: data.content,
      created_at: new Date().toISOString(),
      replies: [],
    };
    return mock;
  }
  try {
    const sql = getSql();
    const rows = await sql`
      INSERT INTO ie_comments (need_id, parent_id, author_name, author_email, content)
      VALUES (
        ${data.needId},
        ${data.parentId ?? null},
        ${data.authorName},
        ${data.authorEmail},
        ${data.content}
      )
      RETURNING id, need_id, parent_id, author_name, author_email, content, created_at
    `;
    return Array.isArray(rows) ? (rows[0] as Comment) ?? null : null;
  } catch (err) {
    console.error("[postComment]", err);
    return null;
  }
}

export async function getVoteScore(needId: string, userEmail?: string): Promise<VoteResult> {
  if (!isNeonConfigured()) {
    return { vote_score: Math.floor(Math.random() * 20) + 5, vote_count: Math.floor(Math.random() * 30) + 8, user_vote: 0 };
  }
  try {
    const sql = getSql();
    const [scoreRow] = await sql`
      SELECT COALESCE(SUM(value), 0) as vote_score, COUNT(*) as vote_count
      FROM ie_votes WHERE need_id = ${needId}
    ` as { vote_score: number; vote_count: number }[];

    let user_vote: -1 | 0 | 1 = 0;
    if (userEmail) {
      const [voteRow] = await sql`
        SELECT value FROM ie_votes WHERE need_id = ${needId} AND user_email = ${userEmail}
      ` as { value: -1 | 1 }[];
      if (voteRow) user_vote = voteRow.value;
    }
    return {
      vote_score: Number(scoreRow?.vote_score ?? 0),
      vote_count: Number(scoreRow?.vote_count ?? 0),
      user_vote,
    };
  } catch (err) {
    console.error("[getVoteScore]", err);
    return { vote_score: 0, vote_count: 0, user_vote: 0 };
  }
}

export async function castVote(needId: string, userEmail: string, value: 1 | -1): Promise<VoteResult> {
  if (!isNeonConfigured()) {
    return { vote_score: value, vote_count: 1, user_vote: value };
  }
  try {
    const sql = getSql();
    await sql`
      INSERT INTO ie_votes (need_id, user_email, value)
      VALUES (${needId}, ${userEmail}, ${value})
      ON CONFLICT (need_id, user_email)
      DO UPDATE SET value = EXCLUDED.value
    `;
    return getVoteScore(needId, userEmail);
  } catch (err) {
    console.error("[castVote]", err);
    return { vote_score: 0, vote_count: 0, user_vote: 0 };
  }
}
