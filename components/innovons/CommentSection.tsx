"use client";

// Usage:
// <CommentSection needId="need-abc" initialComments={comments} />

import { useState, useCallback, useRef } from "react";
import type { Comment } from "@/lib/innovons/forum-queries";

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 60) {
    return `il y a ${Math.max(1, diffMinutes)} minute${diffMinutes !== 1 ? "s" : ""}`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `il y a ${diffHours} heure${diffHours !== 1 ? "s" : ""}`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `il y a ${diffDays} jour${diffDays !== 1 ? "s" : ""}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// Deterministic hue from author name for avatar color
function nameToHue(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

// ── Sub-components ───────────────────────────────────────────────────────────

interface AuthorAvatarProps {
  name: string;
}

function AuthorAvatar({ name }: AuthorAvatarProps) {
  const hue = nameToHue(name);
  return (
    <div
      aria-hidden="true"
      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
      style={{ backgroundColor: `hsl(${hue}, 55%, 38%)` }}
    >
      {getInitials(name)}
    </div>
  );
}

// ── Comment form ─────────────────────────────────────────────────────────────

interface CommentFormProps {
  needId: string;
  parentId?: string;
  onSuccess: (comment: Comment) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}

function CommentForm({
  needId,
  parentId,
  onSuccess,
  onCancel,
  autoFocus = false,
}: CommentFormProps) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CONTENT = 2000;
  const remainingChars = MAX_CONTENT - content.length;
  const isValid = authorName.trim().length > 0 && content.trim().length >= 10;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid || submitting) return;

      setSubmitting(true);
      setError(null);

      // Optimistic comment object
      const optimistic: Comment = {
        id: "optimistic-" + Date.now(),
        need_id: needId,
        parent_id: parentId ?? null,
        author_name: authorName.trim(),
        author_email: authorName.trim().toLowerCase().replace(/\s+/g, ".") + "@ie.bf",
        content: content.trim(),
        created_at: new Date().toISOString(),
        replies: [],
      };

      onSuccess(optimistic);
      setAuthorName("");
      setContent("");

      try {
        const res = await fetch("/api/innovons/forum", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "comment",
            needId,
            authorName: authorName.trim(),
            authorEmail: authorName.trim().toLowerCase().replace(/\s+/g, ".") + "@ie.bf",
            content: content.trim(),
            ...(parentId ? { parentId } : {}),
          }),
        });
        if (!res.ok) throw new Error("Erreur lors de la soumission");
      } catch {
        setError("Une erreur est survenue. Votre commentaire a peut-etre ete enregistre.");
      } finally {
        setSubmitting(false);
      }
    },
    [authorName, content, isValid, needId, parentId, submitting, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div>
        <label
          htmlFor={`author-${parentId ?? "root"}`}
          className="block text-xs font-medium text-gray-400 mb-1"
        >
          Votre nom
        </label>
        <input
          id={`author-${parentId ?? "root"}`}
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Ex: Amadou Traore"
          maxLength={80}
          autoFocus={autoFocus}
          className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:bg-white/15"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor={`content-${parentId ?? "root"}`}
            className="block text-xs font-medium text-gray-400"
          >
            Commentaire
          </label>
          <span
            className={`text-[11px] tabular-nums ${
              remainingChars < 100 ? "text-orange-400" : "text-gray-500"
            }`}
            aria-live="polite"
          >
            {remainingChars} / {MAX_CONTENT}
          </span>
        </div>
        <textarea
          id={`content-${parentId ?? "root"}`}
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Partagez votre avis, experience ou suggestion..."
          minLength={10}
          maxLength={MAX_CONTENT}
          rows={parentId ? 3 : 4}
          className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-500
            resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:bg-white/15"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs text-orange-400">
          {error}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold
            transition-colors hover:from-primary-700 hover:to-primary-600
            disabled:opacity-40 disabled:cursor-not-allowed
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          {submitting ? "Envoi..." : "Commenter"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 transition-colors
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

// ── Single comment card ──────────────────────────────────────────────────────

interface CommentCardProps {
  comment: Comment;
  onReply: (parentId: string, newReply: Comment) => void;
  isReply?: boolean;
}

function CommentCard({ comment, onReply, isReply = false }: CommentCardProps) {
  const [replyOpen, setReplyOpen] = useState(false);

  const handleReplySuccess = useCallback(
    (newReply: Comment) => {
      onReply(comment.id, newReply);
      setReplyOpen(false);
    },
    [comment.id, onReply]
  );

  return (
    <article
      aria-label={`Commentaire de ${comment.author_name}`}
      className="bg-gray-900 rounded-xl p-4"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <AuthorAvatar name={comment.author_name} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-semibold text-white">
              {comment.author_name}
            </span>
            <time
              dateTime={comment.created_at}
              className="text-xs text-gray-500"
            >
              {timeAgo(comment.created_at)}
            </time>
          </div>
          <p className="mt-2 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* Reply trigger — only for top-level comments */}
          {!isReply && (
            <button
              type="button"
              onClick={() => setReplyOpen((o) => !o)}
              aria-expanded={replyOpen}
              className="mt-2 text-xs text-gray-500 hover:text-secondary-600 transition-colors
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-600 rounded"
            >
              {replyOpen ? "Fermer" : "Repondre"}
            </button>
          )}
        </div>
      </div>

      {/* Inline reply form */}
      {replyOpen && (
        <div className="mt-4 border-l-2 border-white/10 ml-12 pl-4">
          <CommentForm
            needId={comment.need_id}
            parentId={comment.id}
            onSuccess={handleReplySuccess}
            onCancel={() => setReplyOpen(false)}
            autoFocus
          />
        </div>
      )}

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div
          className="mt-4 border-l-2 border-white/10 ml-8 pl-4 space-y-3"
          aria-label="Reponses"
        >
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReply={onReply}
              isReply
            />
          ))}
        </div>
      )}
    </article>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

interface CommentSectionProps {
  needId: string;
  initialComments: Comment[];
}

export function CommentSection({ needId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  // Count all comments including replies
  const totalCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length ?? 0),
    0
  );

  const handleNewComment = useCallback((newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  }, []);

  const handleReply = useCallback((parentId: string, newReply: Comment) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== parentId) return c;
        return {
          ...c,
          replies: [...(c.replies ?? []), newReply],
        };
      })
    );
  }, []);

  return (
    <section aria-label="Section discussion">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-bold text-white">Discussion</h2>
        {totalCount > 0 && (
          <span
            aria-label={`${totalCount} commentaire${totalCount !== 1 ? "s" : ""}`}
            className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full
              bg-primary-100 text-primary-700 text-xs font-semibold"
          >
            {totalCount}
          </span>
        )}
      </div>

      {/* New comment form */}
      <div className="bg-gray-900 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
          Laisser un commentaire
        </p>
        <CommentForm needId={needId} onSuccess={handleNewComment} />
      </div>

      {/* Comment list */}
      {comments.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-12 text-center"
          aria-label="Aucun commentaire"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-10 h-10 text-gray-600 mb-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          <p className="text-sm text-gray-500">
            Soyez le premier a commenter
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Partagez votre experience ou proposez des pistes de solution.
          </p>
        </div>
      ) : (
        <ol className="space-y-4" aria-label="Liste des commentaires">
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentCard
                comment={comment}
                onReply={handleReply}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
