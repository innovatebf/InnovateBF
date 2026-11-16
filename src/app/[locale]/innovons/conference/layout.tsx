import { resolveLocale, type LocaleParams } from "@/i18n/server";
import { getPublicContent } from "@/server/content/repository";
import { ConferenceNav } from "./ConferenceNav";

export default async function ConferenceLayout({ children, params }: LocaleParams & { children: React.ReactNode }) {
  const locale = await resolveLocale(params);
  const { conferenceSocial } = (await getPublicContent(locale)).settings;
  return (
    <>
      <ConferenceNav social={conferenceSocial} />
      {children}
    </>
  );
}
