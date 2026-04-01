"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Session {
  time: string;
  title: string;
  speaker: string;
  type: "PLENIERE" | "ATELIER" | "PANEL" | "CEREMONIE";
}

const DAY1_SESSIONS: Session[] = [
  {
    time: "08:30 - 09:30",
    title: "Cérémonie d'ouverture officielle",
    speaker: "Comité d'organisation EBC",
    type: "CEREMONIE",
  },
  {
    time: "09:45 - 10:45",
    title: "L'innovation endogène comme levier de souveraineté technologique",
    speaker: "Dr. Aminata Ouédraogo",
    type: "PLENIERE",
  },
  {
    time: "11:00 - 12:00",
    title: "Financer l'innovation en Afrique : défis et opportunités",
    speaker: "Ibrahim Compaoré",
    type: "PLENIERE",
  },
  {
    time: "14:00 - 15:00",
    title: "Intelligence artificielle et agriculture sahélienne",
    speaker: "Prof. Moussa Kaboré",
    type: "PLENIERE",
  },
  {
    time: "15:15 - 16:45",
    title: "Atelier 1 : Design Thinking pour les problèmes sociétaux",
    speaker: "Fatimata Sawadogo",
    type: "ATELIER",
  },
  {
    time: "15:15 - 16:45",
    title: "Atelier 2 : Prototypage rapide et validation terrain",
    speaker: "Jean-Baptiste Tapsoba",
    type: "ATELIER",
  },
];

const DAY2_SESSIONS: Session[] = [
  {
    time: "09:00 - 10:30",
    title: "Panel : La diaspora comme moteur de transfert technologique",
    speaker: "Modéré par Aïcha Traoré",
    type: "PANEL",
  },
  {
    time: "10:45 - 12:15",
    title: "Panel : Partenariats public-privé pour l'innovation",
    speaker: "Modéré par Dr. Paul Zoungrana",
    type: "PANEL",
  },
  {
    time: "14:00 - 15:30",
    title: "Atelier Innovation : Hackathon des solutions endogènes",
    speaker: "Équipe InnovateBF",
    type: "ATELIER",
  },
  {
    time: "16:00 - 17:00",
    title: "Cérémonie de remise des prix de l'innovation",
    speaker: "Jury EBC 2026",
    type: "CEREMONIE",
  },
  {
    time: "17:00 - 17:45",
    title: "Discours de clôture et perspectives 2027",
    speaker: "Présidence InnovateBF",
    type: "CEREMONIE",
  },
];

function getTypeBadgeClasses(type: Session["type"]): string {
  switch (type) {
    case "PLENIERE":
      return "bg-blue-100 text-blue-700";
    case "ATELIER":
      return "bg-amber-100 text-amber-700";
    case "PANEL":
      return "bg-purple-100 text-purple-700";
    case "CEREMONIE":
      return "bg-secondary-100 text-secondary-700";
  }
}

function getTypeLabel(type: Session["type"], t: ReturnType<typeof useTranslations>): string {
  switch (type) {
    case "PLENIERE":
      return t("session_plenary");
    case "ATELIER":
      return t("session_workshop");
    case "PANEL":
      return t("session_panel");
    case "CEREMONIE":
      return t("session_ceremony");
  }
}

export function ConferenceTabs() {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const t = useTranslations("innovons.conference");

  const sessions = activeDay === 1 ? DAY1_SESSIONS : DAY2_SESSIONS;

  return (
    <div>
      {/* Tab buttons */}
      <div className="mb-8 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveDay(1)}
          className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
            activeDay === 1
              ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {t("day1")} — 15 Oct.
        </button>
        <button
          type="button"
          onClick={() => setActiveDay(2)}
          className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
            activeDay === 2
              ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {t("day2")} — 16 Oct.
        </button>
      </div>

      {/* Sessions list */}
      <div className="space-y-4">
        {sessions.map((session, idx) => (
          <div
            key={`${activeDay}-${idx}`}
            className="flex gap-4 rounded-xl bg-white p-5 shadow-[0_20px_40px_rgba(25,28,29,0.05)] transition-all hover:shadow-[0_20px_40px_rgba(25,28,29,0.10)]"
          >
            {/* Time */}
            <div className="hidden w-36 shrink-0 sm:block">
              <span className="text-sm font-semibold text-secondary-600">
                {session.time}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTypeBadgeClasses(session.type)}`}
                >
                  {getTypeLabel(session.type, t)}
                </span>
                <span className="text-xs text-gray-400 sm:hidden">
                  {session.time}
                </span>
              </div>
              <h4 className="text-base font-semibold text-gray-900">
                {session.title}
              </h4>
              <p className="mt-1 text-sm text-gray-500">{session.speaker}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
