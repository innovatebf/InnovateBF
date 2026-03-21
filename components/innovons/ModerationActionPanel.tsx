"use client";

import { useState, useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import { CheckCircle, RotateCcw, XCircle, Send, Loader2, Mail } from "lucide-react";
import type { NeedStatus } from "@/lib/innovons/types";

// ── Types ───────────────────────────────────────────────────────────────────

type ModerationAction = "APPROVED" | "REVISION_REQUESTED" | "REJECTED";

interface ModerationActionPanelProps {
  needId: string;
  currentStatus: NeedStatus;
  needTitle: string;
  needSlug: string;
  authorEmail: string;
  authorName: string;
}

interface ActionOption {
  value: ModerationAction;
  label: string;
  description: string;
  icon: React.ElementType;
  selectedBg: string;
  selectedBorder: string;
  selectedText: string;
}

// ── Constants ───────────────────────────────────────────────────────────────

const ACTION_OPTIONS: ActionOption[] = [
  {
    value: "APPROVED",
    label: "Approuver",
    description: "Le besoin sera publie sur la plateforme",
    icon: CheckCircle,
    selectedBg: "bg-green-900/20",
    selectedBorder: "border-green-600",
    selectedText: "text-green-400",
  },
  {
    value: "REVISION_REQUESTED",
    label: "Demander revision",
    description: "L'auteur sera invite a modifier son besoin",
    icon: RotateCcw,
    selectedBg: "bg-amber-900/20",
    selectedBorder: "border-amber-600",
    selectedText: "text-amber-400",
  },
  {
    value: "REJECTED",
    label: "Rejeter",
    description: "Le besoin sera archive et ne sera pas publie",
    icon: XCircle,
    selectedBg: "bg-red-900/20",
    selectedBorder: "border-red-600",
    selectedText: "text-red-400",
  },
];

const MIN_COMMENT_LENGTH = 20;

// ── Component ───────────────────────────────────────────────────────────────

export function ModerationActionPanel({
  needId,
  currentStatus: _currentStatus,
  needTitle,
  needSlug,
  authorEmail,
  authorName,
}: ModerationActionPanelProps) {
  const router = useRouter();

  const [selectedAction, setSelectedAction] = useState<ModerationAction | null>(null);
  const [comment, setComment] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isCommentValid = comment.trim().length >= MIN_COMMENT_LENGTH;
  const canSubmit = selectedAction !== null && isCommentValid && !isSubmitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !selectedAction) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/innovons/admin/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          needId,
          action: selectedAction,
          comment: comment.trim(),
          sendEmail,
          authorEmail,
          authorName,
          needTitle,
          needSlug,
        }),
      });

      if (!response.ok) {
        const errorData: { error?: string } = await response.json();
        throw new Error(errorData.error ?? "Erreur lors de la soumission");
      }

      setShowToast(true);

      setTimeout(() => {
        router.push("/innovons/admin/moderation");
      }, 1500);
    } catch (err) {
      // Show inline error — simple approach without external toast library
      console.error("[ModerationActionPanel]", err);
      setIsSubmitting(false);
    }
  }, [canSubmit, selectedAction, needId, comment, sendEmail, authorEmail, authorName, needTitle, needSlug, router]);

  return (
    <>
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
        {/* Header */}
        <h3 className="text-base font-semibold text-white">
          Decision de moderation
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Selectionnez une action et justifiez votre decision
        </p>

        {/* Action buttons - radio style */}
        <div className="mt-5 space-y-3">
          {ACTION_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedAction === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedAction(option.value)}
                disabled={isSubmitting}
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? `${option.selectedBg} ${option.selectedBorder}`
                    : "border-gray-800 bg-gray-800/30 hover:border-gray-700"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {/* Radio indicator */}
                <div
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? option.selectedBorder
                      : "border-gray-600"
                  }`}
                >
                  {isSelected && (
                    <div
                      className={`size-2.5 rounded-full ${
                        option.value === "APPROVED"
                          ? "bg-green-500"
                          : option.value === "REVISION_REQUESTED"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`size-4 ${isSelected ? option.selectedText : "text-gray-500"}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? option.selectedText : "text-gray-300"
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Comment textarea */}
        <div className="mt-5">
          <label htmlFor="moderation-comment" className="text-sm font-medium text-gray-300">
            Commentaire
            <span className="ml-1 text-red-400">*</span>
          </label>
          <textarea
            id="moderation-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
            placeholder="Justifiez votre decision (min. 20 caracteres)..."
            rows={4}
            className="mt-2 w-full resize-none rounded-lg border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="mt-1.5 flex items-center justify-between">
            <p
              className={`text-xs ${
                comment.trim().length > 0 && !isCommentValid
                  ? "text-red-400"
                  : "text-gray-600"
              }`}
            >
              {comment.trim().length > 0 && !isCommentValid
                ? `Minimum ${MIN_COMMENT_LENGTH} caracteres requis`
                : "Obligatoire"}
            </p>
            <span
              className={`text-xs ${
                isCommentValid ? "text-green-500" : "text-gray-600"
              }`}
            >
              {comment.trim().length}/{MIN_COMMENT_LENGTH}
            </span>
          </div>
        </div>

        {/* Email notification checkbox */}
        <div className="mt-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              disabled={isSubmitting}
              className="mt-0.5 size-4 rounded border-gray-700 bg-gray-800 text-green-600 focus:ring-green-600 focus:ring-offset-0 disabled:cursor-not-allowed"
            />
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <Mail className="size-3.5" aria-hidden="true" />
              Envoyer email de notification a l&apos;auteur
            </span>
          </label>
        </div>

        {/* Submit button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-600"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Traitement en cours...
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              Valider la decision
            </>
          )}
        </button>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-green-800 bg-green-900/90 px-5 py-3 text-sm font-medium text-green-300 shadow-lg backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="size-4 text-green-400" aria-hidden="true" />
          Decision enregistree
        </div>
      )}
    </>
  );
}
