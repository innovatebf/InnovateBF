import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  Users,
  Mic,
  Layers,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { IENavbar } from "@/components/innovons/IENavbar";
import { ConferenceTabs } from "@/components/innovons/ConferenceTabs";
import { Ebc26FeaturedCard } from "@/components/home/Ebc26FeaturedCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "innovons.conference",
  });
  return {
    title: t("page_title"),
    description: t("tagline"),
  };
}

interface Speaker {
  name: string;
  title: string;
  organization: string;
  initials: string;
  color: string;
}

const SPEAKERS: Speaker[] = [
  {
    name: "Dr. Aminata Ouédraogo",
    title: "Directrice de la Recherche",
    organization: "CNRST Burkina Faso",
    initials: "AO",
    color: "bg-secondary-700",
  },
  {
    name: "Ibrahim Compaoré",
    title: "Directeur Général",
    organization: "Fonds National de l'Innovation",
    initials: "IC",
    color: "bg-blue-600",
  },
  {
    name: "Prof. Moussa Kaboré",
    title: "Professeur d'Informatique",
    organization: "Université Joseph Ki-Zerbo",
    initials: "MK",
    color: "bg-purple-600",
  },
  {
    name: "Fatimata Sawadogo",
    title: "CEO & Fondatrice",
    organization: "TechFaso Labs",
    initials: "FS",
    color: "bg-amber-600",
  },
  {
    name: "Aïcha Traoré",
    title: "Présidente",
    organization: "Diaspora Tech Burkina",
    initials: "AT",
    color: "bg-red-600",
  },
  {
    name: "Dr. Paul Zoungrana",
    title: "Conseiller spécial Innovation",
    organization: "Primature du Burkina Faso",
    initials: "PZ",
    color: "bg-teal-600",
  },
];

export default async function ConferencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tc = await getTranslations("innovons.conference");
  const tf = await getTranslations("innovons.footer");

  return (
    <div className="min-h-screen">
      <IENavbar />

      {/* Hero */}
      <section className="bg-[#0D0D0D] px-4 py-20 text-white lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl text-center">
          {/* EBC Logo */}
          <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 text-2xl font-black text-white shadow-[0_20px_40px_rgba(183,0,17,0.3)]">
            EBC
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {tc("page_title")}
          </h1>
          <p className="mt-4 text-xl font-medium text-secondary-400">
            {tc("tagline")}
          </p>
          <p className="mt-6 text-lg text-gray-400">
            <Calendar
              className="mr-2 inline-block size-5"
              aria-hidden="true"
            />
            {tc("date")} &bull; {tc("location")}
          </p>
          <div className="mt-8">
            <a
              href="#inscription"
              className="inline-flex rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600"
            >
              {tc("register")}
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              {
                icon: Users,
                label: tc("stats_participants"),
                value: "500+",
              },
              {
                icon: Mic,
                label: tc("stats_speakers"),
                value: "30+",
              },
              {
                icon: Layers,
                label: tc("stats_themes"),
                value: "3",
              },
              {
                icon: Calendar,
                label: tc("stats_days"),
                value: "2",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-xl bg-gray-50 p-6 text-center shadow-[0_20px_40px_rgba(25,28,29,0.05)]"
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary-50">
                  <Icon
                    className="size-6 text-primary-600"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-3 text-3xl font-black text-gray-900">
                  {value}
                </p>
                <p className="mt-1 text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call for projects */}
      <Ebc26FeaturedCard />

      {/* Programme */}
      <section className="bg-gray-50 px-4 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <span className="inline-block rounded-full bg-secondary-100 px-4 py-1.5 text-xs font-semibold text-secondary-700">
              {tc("program")}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 lg:text-4xl">
              {tc("program")} EBC 2026
            </h2>
          </div>

          <ConferenceTabs />
        </div>
      </section>

      {/* Speakers */}
      <section className="bg-white px-4 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <span className="inline-block rounded-full bg-secondary-100 px-4 py-1.5 text-xs font-semibold text-secondary-700">
              {tc("speakers")}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 lg:text-4xl">
              {tc("speakers")}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SPEAKERS.map((speaker) => (
              <div
                key={speaker.name}
                className="flex flex-col items-center rounded-xl bg-[#f8f9fa] p-6 text-center shadow-[0_20px_40px_rgba(25,28,29,0.05)] transition-shadow hover:shadow-[0_20px_40px_rgba(25,28,29,0.10)]"
              >
                <div
                  className={`flex size-16 items-center justify-center rounded-full text-lg font-bold text-white ${speaker.color}`}
                >
                  {speaker.initials}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {speaker.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{speaker.title}</p>
                <p className="mt-0.5 text-xs font-medium text-secondary-600">
                  {speaker.organization}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section
        id="inscription"
        className="bg-gray-100 px-4 py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-lg">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {tc("registration_title")}
            </h2>
            <p className="mt-2 text-gray-500">
              {tc("date")} &bull; {tc("location")}
            </p>
          </div>

          <form className="rounded-xl bg-white p-6 shadow-[0_20px_40px_rgba(25,28,29,0.05)]">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="reg-name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  {tc("registration_name")}
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  className="w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  {tc("registration_email")}
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  className="w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-org"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  {tc("registration_org")}
                </label>
                <input
                  id="reg-org"
                  type="text"
                  className="w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-type"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  {tc("registration_type")}
                </label>
                <select
                  id="reg-type"
                  className="w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500/30"
                >
                  <option value="attendee">
                    {tc("registration_type_attendee")}
                  </option>
                  <option value="speaker">
                    {tc("registration_type_speaker")}
                  </option>
                  <option value="sponsor">
                    {tc("registration_type_sponsor")}
                  </option>
                  <option value="press">
                    {tc("registration_type_press")}
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:from-primary-700 hover:to-primary-600"
            >
              {tc("registration_submit")}
            </button>
          </form>
        </div>
      </section>

      {/* Footer IE */}
      <footer
        className="bg-[#111827] py-12 text-gray-400"
        aria-label="Pied de page InnovonsEnsembleLeFaso"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 text-sm font-black text-white">
                  IE
                </div>
                <span className="font-bold text-white">
                  InnovonsEnsembleLeFaso
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{tf("tagline")}</p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">
                {tf("quick_links")}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/innovons/besoins"
                    className="transition-colors hover:text-white"
                  >
                    {tf("link_catalog")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/innovons/appels"
                    className="transition-colors hover:text-white"
                  >
                    {tf("link_calls")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/innovons/conference"
                    className="transition-colors hover:text-white"
                  >
                    {tf("link_conference")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">
                {tf("contact")}
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail
                    className="size-4 shrink-0 text-secondary-500"
                    aria-hidden="true"
                  />
                  <span>{tf("email")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone
                    className="size-4 shrink-0 text-secondary-500"
                    aria-hidden="true"
                  />
                  <span>{tf("phone")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin
                    className="size-4 shrink-0 text-secondary-500"
                    aria-hidden="true"
                  />
                  <span>{tf("location")}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs">
            {tf("copyright")}
          </div>
        </div>
      </footer>
    </div>
  );
}
