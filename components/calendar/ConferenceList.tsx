"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Calendar, Tag, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Conference {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  city: string;
  venue: string;
  topics: string[];
  description: string;
  attendees: number;
  category: string;
}

const conferences: Conference[] = [
  {
    id: "BF-2026-001",
    title: "Sommet Africain de l'Intelligence Artificielle",
    startDate: "2026-03-15",
    endDate: "2026-03-17",
    city: "Ouagadougou",
    venue: "Centre International de Conférences de Ouaga 2000",
    topics: ["Intelligence Artificielle", "Machine Learning", "Deep Learning", "Éthique IA"],
    description: "Premier sommet panafricain dédié à l'IA et ses applications en Afrique",
    attendees: 500,
    category: "technology"
  },
  {
    id: "BF-2026-002",
    title: "Forum Innovation Agritech Sahel",
    startDate: "2026-04-10",
    endDate: "2026-04-12",
    city: "Bobo Dioulasso",
    venue: "Palais des Sports",
    topics: ["Agriculture", "IoT", "Irrigation", "Climat"],
    description: "Innovations technologiques pour l'agriculture sahélienne",
    attendees: 300,
    category: "agriculture"
  },
  {
    id: "BF-2026-003",
    title: "Conférence Cybersécurité & Souveraineté Numérique",
    startDate: "2026-05-20",
    endDate: "2026-05-22",
    city: "Ouagadougou",
    venue: "Hôtel Azalaï",
    topics: ["Cybersécurité", "Cryptographie", "Protection des données", "Blockchain"],
    description: "Sécurité des systèmes d'information et souveraineté numérique africaine",
    attendees: 250,
    category: "security"
  },
  {
    id: "BF-2026-004",
    title: "Symposium Santé Numérique Afrique",
    startDate: "2026-06-05",
    endDate: "2026-06-07",
    city: "Koudougou",
    venue: "Université Norbert Zongo",
    topics: ["E-santé", "Télémédecine", "Dossier médical", "Diagnostic IA"],
    description: "Technologies numériques pour améliorer l'accès aux soins de santé",
    attendees: 200,
    category: "health"
  },
  {
    id: "BF-2026-005",
    title: "Tech Entrepreneuriat & Startups Summit",
    startDate: "2026-07-15",
    endDate: "2026-07-16",
    city: "Ouagadougou",
    venue: "Ouaga Start-Up House",
    topics: ["Startups", "Financement", "Pitch", "Incubation"],
    description: "Rencontre entre entrepreneurs tech et investisseurs",
    attendees: 400,
    category: "entrepreneurship"
  },
  {
    id: "BF-2026-006",
    title: "Conférence Énergie Renouvelable & Smart Grids",
    startDate: "2026-09-10",
    endDate: "2026-09-12",
    city: "Banfora",
    venue: "Centre Culturel de Banfora",
    topics: ["Énergie solaire", "Smart Grid", "Stockage", "IoT Énergie"],
    description: "Solutions énergétiques durables et réseaux intelligents",
    attendees: 180,
    category: "energy"
  },
  {
    id: "BF-2026-007",
    title: "Forum Éducation Numérique & EdTech",
    startDate: "2026-10-08",
    endDate: "2026-10-10",
    city: "Tenkodogo",
    venue: "Lycée Départemental",
    topics: ["EdTech", "E-learning", "MOOC", "Éducation inclusive"],
    description: "Transformation numérique de l'éducation au Burkina Faso",
    attendees: 220,
    category: "education"
  },
  {
    id: "BF-2026-008",
    title: "Conférence Blockchain & Fintech Afrique",
    startDate: "2026-11-12",
    endDate: "2026-11-14",
    city: "Ouagadougou",
    venue: "Chambre de Commerce et d'Industrie",
    topics: ["Blockchain", "Fintech", "Mobile Money", "DeFi"],
    description: "Technologies financières et inclusion financière en Afrique",
    attendees: 350,
    category: "finance"
  },
  {
    id: "BF-2026-009",
    title: "Symposium Drones & Cartographie",
    startDate: "2026-11-25",
    endDate: "2026-11-26",
    city: "Ouahigouya",
    venue: "Gouvernorat du Nord",
    topics: ["Drones", "Cartographie", "Agriculture de précision", "Surveillance"],
    description: "Applications des drones pour le développement territorial",
    attendees: 150,
    category: "technology"
  },
  {
    id: "BF-2026-010",
    title: "Forum Open Source & Logiciels Libres",
    startDate: "2026-12-05",
    endDate: "2026-12-06",
    city: "Dori",
    venue: "Préfecture de Dori",
    topics: ["Open Source", "Linux", "Logiciels libres", "Souveraineté"],
    description: "Promotion des logiciels libres pour la souveraineté numérique",
    attendees: 120,
    category: "technology"
  }
];

export function ConferenceList() {
  const t = useTranslations("domains.calendar");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const cities = ["Ouagadougou", "Bobo Dioulasso", "Koudougou", "Tenkodogo", "Ouahigouya", "Banfora", "Dori"];

  const categories = [
    { value: "technology", label: t("categories.technology") },
    { value: "agriculture", label: t("categories.agriculture") },
    { value: "security", label: t("categories.security") },
    { value: "health", label: t("categories.health") },
    { value: "entrepreneurship", label: t("categories.entrepreneurship") },
    { value: "energy", label: t("categories.energy") },
    { value: "education", label: t("categories.education") },
    { value: "finance", label: t("categories.finance") }
  ];

  const months = [
    { value: "03", label: t("months.march") },
    { value: "04", label: t("months.april") },
    { value: "05", label: t("months.may") },
    { value: "06", label: t("months.june") },
    { value: "07", label: t("months.july") },
    { value: "09", label: t("months.september") },
    { value: "10", label: t("months.october") },
    { value: "11", label: t("months.november") },
    { value: "12", label: t("months.december") }
  ];

  const filteredConferences = conferences.filter(conf => {
    if (selectedCity !== "all" && conf.city !== selectedCity) return false;
    if (selectedMonth !== "all" && !conf.startDate.includes(`-${selectedMonth}-`)) return false;
    if (selectedCategory !== "all" && conf.category !== selectedCategory) return false;
    return true;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Filtres */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/50">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{t("filters.title")}</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Filtre Ville */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("filters.city")}
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all hover:border-gray-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">{t("filters.all_cities")}</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Filtre Mois */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("filters.month")}
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all hover:border-gray-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">{t("filters.all_months")}</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          {/* Filtre Catégorie */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("filters.category")}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all hover:border-gray-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">{t("filters.all_categories")}</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Compteur de résultats */}
        <div className="mt-4 text-sm text-gray-600">
          {t("filters.results", { count: filteredConferences.length })}
        </div>
      </div>

      {/* Liste des conférences */}
      <div className="space-y-6">
        {filteredConferences.length === 0 ? (
          <div className="rounded-3xl bg-gray-50 p-12 text-center">
            <Calendar className="mx-auto mb-4 size-12 text-gray-400" />
            <p className="text-gray-600">{t("no_conferences")}</p>
          </div>
        ) : (
          filteredConferences.map((conf) => (
            <div
              key={conf.id}
              className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-primary-500/50"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-3">
                  {/* Titre */}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600">
                    {conf.title}
                  </h3>

                  {/* Date et lieu */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-primary-600" />
                      <span>{formatDate(conf.startDate)} - {formatDate(conf.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary-600" />
                      <span>{conf.city}, {conf.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-primary-600" />
                      <span>{conf.attendees} {t("attendees")}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-6 text-gray-600">
                    {conf.description}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2">
                    {conf.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                      >
                        <Tag className="size-3" />
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* ID */}
                  <div className="text-xs text-gray-500">
                    {t("event_id")}: {conf.id}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 lg:flex-col">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    {t("save")}
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full bg-primary-600 hover:bg-primary-700"
                  >
                    {t("details")}
                    <ExternalLink className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
