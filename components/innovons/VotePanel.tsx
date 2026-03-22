"use client";

// Usage:
// <VotePanel needId="need-abc" initialScore={12} initialCount={18} />

import { useState, useCallback } from "react";

interface VotePanelProps {
  needId: string;
  initialScore: number;
  initialCount: number;
}

export function VotePanel({ needId, initialScore, initialCount }: VotePanelProps) {
  const [score, setScore] = useState(initialScore);
  const [count, setCount] = useState(initialCount);
  const [userVote, setUserVote] = useState<-1 | 0 | 1>(0);
  const [pending, setPending] = useState(false);

  const handleVote = useCallback(
    async (direction: 1 | -1) => {
      if (pending) return;

      // If user clicks the same direction again, toggle off (send opposite to remove)
      const value: 1 | -1 = userVote === direction ? ((-direction) as 1 | -1) : direction;
      const prevScore = score;
      const prevCount = count;
      const prevUserVote = userVote;

      // Optimistic update
      if (userVote === direction) {
        // Removing existing vote
        setScore((s) => s - direction);
        setCount((c) => Math.max(0, c - 1));
        setUserVote(0);
      } else if (userVote === 0) {
        // New vote
        setScore((s) => s + direction);
        setCount((c) => c + 1);
        setUserVote(direction);
      } else {
        // Switching vote direction (e.g. from +1 to -1)
        setScore((s) => s + direction * 2);
        setUserVote(direction);
      }

      setPending(true);
      try {
        const res = await fetch("/api/innovons/forum", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "vote",
            needId,
            userEmail: "anonymous@ie.bf",
            value,
          }),
        });

        if (!res.ok) throw new Error("Vote failed");

        const data = await res.json();
        if (data.vote_score !== undefined) setScore(Number(data.vote_score));
        if (data.vote_count !== undefined) setCount(Number(data.vote_count));
      } catch {
        // Revert optimistic update on error
        setScore(prevScore);
        setCount(prevCount);
        setUserVote(prevUserVote);
      } finally {
        setPending(false);
      }
    },
    [needId, pending, score, count, userVote]
  );

  return (
    <div className="flex flex-col items-center gap-1 bg-gray-800 rounded-xl p-4 select-none min-w-[56px]">
      {/* Up vote */}
      <button
        aria-label="Voter pour ce besoin"
        aria-pressed={userVote === 1}
        disabled={pending}
        onClick={() => handleVote(1)}
        className={[
          "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500",
          userVote === 1
            ? "text-green-400 bg-green-400/15 hover:bg-green-400/25"
            : "text-gray-400 hover:text-green-400 hover:bg-gray-700",
          pending ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M12 4l8 8H4z" />
        </svg>
      </button>

      {/* Score */}
      <span
        className="text-lg font-bold text-white leading-none py-1 tabular-nums"
        aria-label={`Score: ${score}`}
      >
        {score}
      </span>

      {/* Down vote */}
      <button
        aria-label="Voter contre ce besoin"
        aria-pressed={userVote === -1}
        disabled={pending}
        onClick={() => handleVote(-1)}
        className={[
          "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500",
          userVote === -1
            ? "text-red-400 bg-red-400/15 hover:bg-red-400/25"
            : "text-gray-400 hover:text-red-400 hover:bg-gray-700",
          pending ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M12 20l-8-8h16z" />
        </svg>
      </button>

      {/* Vote count label */}
      <span className="text-[11px] text-gray-500 mt-1 text-center leading-tight">
        {count} vote{count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
