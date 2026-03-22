-- Migration 006: Forum — votes et commentaires pour ie_needs
-- Compatible Neon PostgreSQL (pas de syntaxe Supabase-specific)

-- Table ie_votes: one vote per user per need
CREATE TABLE IF NOT EXISTS ie_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES ie_needs(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  value SMALLINT NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(need_id, user_email)
);

-- Table ie_comments: threaded comments on needs
CREATE TABLE IF NOT EXISTS ie_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES ie_needs(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES ie_comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 10 AND 2000),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- View: ie_needs_with_votes (adds vote_score and vote_count to needs)
CREATE OR REPLACE VIEW ie_needs_with_votes AS
SELECT
  n.*,
  COALESCE(SUM(v.value), 0) AS vote_score,
  COUNT(v.id) AS vote_count,
  COUNT(c.id) AS comment_count
FROM ie_needs n
LEFT JOIN ie_votes v ON v.need_id = n.id
LEFT JOIN ie_comments c ON c.need_id = n.id
GROUP BY n.id;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_ie_votes_need_id ON ie_votes(need_id);
CREATE INDEX IF NOT EXISTS idx_ie_comments_need_id ON ie_comments(need_id);
CREATE INDEX IF NOT EXISTS idx_ie_comments_parent_id ON ie_comments(parent_id);
