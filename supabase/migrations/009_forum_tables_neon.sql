-- ============================================================
-- Migration 009: ie_comments + ie_votes (Neon PostgreSQL)
-- Tables pour le forum et le système de votes de la plateforme IE
-- ============================================================

CREATE TABLE IF NOT EXISTS ie_comments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id      UUID NOT NULL,
  parent_id    UUID REFERENCES ie_comments(id) ON DELETE CASCADE,
  author_name  TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ie_comments_need_id ON ie_comments (need_id);
CREATE INDEX IF NOT EXISTS idx_ie_comments_parent_id ON ie_comments (parent_id);

CREATE TABLE IF NOT EXISTS ie_votes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id    UUID NOT NULL,
  user_email TEXT NOT NULL,
  value      SMALLINT NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (need_id, user_email)
);
CREATE INDEX IF NOT EXISTS idx_ie_votes_need_id ON ie_votes (need_id);
