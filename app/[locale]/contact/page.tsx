import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/forms/ContactForm";
import { Mail, MapPin } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Page header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        {/* Content grid */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Coordonnées
              </h2>
              <p className="mt-4 text-gray-600">
                N'hésitez pas à nous contacter pour toute question ou
                collaboration.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a
                    href="mailto:contact@innovatebf.org"
                    className="mt-1 text-gray-600 hover:text-primary-600"
                  >
                    contact@innovatebf.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Localisation</h3>
                  <p className="mt-1 text-gray-600">
                    Ouagadougou, Burkina Faso
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
