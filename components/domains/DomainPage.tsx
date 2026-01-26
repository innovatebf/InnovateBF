import { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

interface DomainPageProps {
  icon: ReactNode;
  title: string;
  description: string;
  backLabel: string;
}

export function DomainPage({
  icon,
  title,
  description,
  backLabel,
}: DomainPageProps) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Back link */}
        <Link
          href="/domains"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>

        {/* Page header */}
        <div className="mt-8">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            {icon}
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">{description}</p>
        </div>

        {/* Placeholder content */}
        <div className="mt-16 space-y-8">
          <div className="rounded-lg bg-gray-50 p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Contenu à venir
            </h2>
            <p className="mt-4 text-gray-600">
              Cette page sera enrichie prochainement avec du contenu détaillé
              sur ce domaine d'action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
