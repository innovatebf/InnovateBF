import "server-only";

/**
 * Envoi d'e-mails via l'API HTTP de Resend (https://resend.com).
 * Variables requises : RESEND_API_KEY, MAIL_FROM, MAIL_TO.
 * L'e-mail n'est qu'une notification : chaque envoi de formulaire est d'abord
 * enregistré en base et consultable dans le back-office. En cas d'absence de
 * configuration ou de panne de Resend, la fonction renvoie false sans lever d'erreur.
 */
export async function sendMail({
  subject,
  text,
  replyTo,
  to,
}: {
  subject: string;
  text: string;
  replyTo?: string;
  /** Destinataire : par défaut l'adresse de l'équipe (MAIL_TO) */
  to?: string;
}): Promise<boolean> {
  const { RESEND_API_KEY, MAIL_FROM, MAIL_TO } = process.env;
  if (!RESEND_API_KEY || !MAIL_FROM || !MAIL_TO) {
    console.error("[mail] RESEND_API_KEY, MAIL_FROM ou MAIL_TO manquant : message non envoyé");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: to ? [to] : MAIL_TO.split(",").map((s) => s.trim()),
        subject,
        text,
        reply_to: replyTo,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error("[mail] échec Resend", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[mail] Resend injoignable", e);
    return false;
  }
}
