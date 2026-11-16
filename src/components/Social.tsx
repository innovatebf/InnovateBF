/** Icônes des réseaux sociaux (pied de page, barre et page de la conférence). */

const icons = {
  facebook: <path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4a20 20 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21h2.9z" />,
  linkedin: <path d="M6.9 8.8H3.6V20h3.3V8.8zM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.4 13.7c0-3.1-1.7-5.1-4.4-5.1-1.6 0-2.6.9-3.1 1.6V8.8H9.7V20H13v-5.9c0-1.5.5-2.8 2-2.8s1.9 1.3 1.9 2.9V20h3.4v-6.3z" />,
  x: <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" />,
  youtube: <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" />,
  instagram: (
    <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 4.6c2.4 0 2.7 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.5-.1-3.6-1.3-3.7-3.7-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6c.1-2.4 1.3-3.6 3.7-3.7.9-.1 1.2-.1 3.6-.1zM12 3c-2.4 0-2.7 0-3.7.1C5 3.2 3.2 5 3.1 8.3 3 9.3 3 9.6 3 12s0 2.7.1 3.7C3.2 19 5 20.8 8.3 20.9c1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c3.3-.1 5.1-1.9 5.2-5.2.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7C20.8 5 19 3.2 15.7 3.1 14.7 3 14.4 3 12 3z" />
  ),
  tiktok: (
    <path d="M16.6 3c.3 2.1 1.5 3.6 3.6 3.9v2.6c-1.3.1-2.5-.3-3.6-1v5.9c0 3.4-2.4 5.6-5.4 5.6a5.3 5.3 0 0 1-5.4-5.4c0-3.3 2.8-5.7 6.1-5.2v2.7a2.6 2.6 0 0 0-3.4 2.5 2.6 2.6 0 0 0 2.7 2.7c1.6 0 2.7-1.1 2.7-3.1V3h2.7z" />
  ),
  whatsapp: (
    <path d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.6 21.5l4.9-1.3A9.4 9.4 0 1 0 12 2.5zm0 17.2c-1.4 0-2.8-.4-4-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A7.8 7.8 0 1 1 12 19.7zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3c-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.6-.3z" />
  ),
};

export type Network = keyof typeof icons;

const NAMES: Record<Network, string> = {
  facebook: "Facebook",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
};

const ORDER = Object.keys(icons) as Network[];

/** Réseaux renseignés, dans un ordre stable (les champs vides sont ignorés). */
export function socialLinks(accounts: Partial<Record<string, string>>) {
  return ORDER.filter((n) => accounts[n]).map((n) => ({ network: n, name: NAMES[n], href: accounts[n] as string }));
}

/**
 * Liste d'icônes cliquables. `owner` sert à l'étiquette accessible
 * (« EBC2026 sur Facebook »), `on` est le mot de liaison de la langue de la page.
 */
export function SocialLinks({
  accounts,
  owner,
  on,
  className,
  iconClassName = "size-[48%]",
}: {
  accounts: Partial<Record<string, string>>;
  owner: string;
  on: string;
  className?: string;
  iconClassName?: string;
}) {
  const links = socialLinks(accounts);
  if (links.length === 0) return null;
  return (
    <ul className={className}>
      {links.map((s) => (
        <li key={s.network}>
          <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${owner} ${on} ${s.name}`} title={s.name}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={iconClassName} aria-hidden="true">
              {icons[s.network]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
