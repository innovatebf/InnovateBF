// Email service pour notifications de statut IE
// Utilise Resend si configure, sinon log en console (dev mode)

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes("your-resend")) {
    // Mode dev : log en console
    console.log("[IE Email - DEV MODE]", {
      to: payload.to,
      subject: payload.subject,
      preview: payload.html.replace(/<[^>]+>/g, "").slice(0, 100),
    });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "InnovonsEnsembleLeFaso <noreply@innovatebf.org>",
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
    }),
  });

  if (!response.ok) {
    console.error("[IE Email] Failed to send:", await response.text());
  }
}

export async function sendNeedApprovedEmail(params: {
  to: string;
  authorName: string;
  needTitle: string;
  needSlug: string;
  siteUrl?: string;
}): Promise<void> {
  const url =
    params.siteUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://innovatebf.org";

  await sendEmail({
    to: params.to,
    subject: `Votre besoin a ete publie — ${params.needTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #16a34a; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">InnovonsEnsembleLeFaso</h1>
        </div>
        <div style="padding: 32px; background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #111827;">Felicitations, ${params.authorName} !</h2>
          <p style="color: #374151;">Votre besoin a ete examine et <strong style="color: #16a34a;">approuve par notre equipe</strong>. Il est maintenant visible sur la plateforme.</p>
          <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <strong style="color: #15803d;">${params.needTitle}</strong>
          </div>
          <a href="${url}/innovons/besoins/${params.needSlug}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
            Voir mon besoin publie
          </a>
          <p style="color: #6b7280; margin-top: 32px; font-size: 14px;">
            Des innovateurs pourront maintenant proposer des solutions a votre besoin.
          </p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          InnovateBF — Thinktank pour la technologie endogene au Burkina Faso
        </p>
      </div>
    `,
  });
}

export async function sendNeedRejectedEmail(params: {
  to: string;
  authorName: string;
  needTitle: string;
  comment: string;
}): Promise<void> {
  await sendEmail({
    to: params.to,
    subject: `Votre besoin necessite des modifications — ${params.needTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">InnovonsEnsembleLeFaso</h1>
        </div>
        <div style="padding: 32px; background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #111827;">Bonjour ${params.authorName},</h2>
          <p style="color: #374151;">Votre besoin a ete examine par notre equipe. Malheureusement, il <strong style="color: #dc2626;">n'a pas pu etre publie</strong> en l'etat.</p>
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <strong style="color: #991b1b;">Besoin :</strong> ${params.needTitle}<br/>
            <strong style="color: #991b1b; margin-top: 8px; display: block;">Commentaire :</strong>
            <p style="color: #374151; margin: 4px 0 0;">${params.comment}</p>
          </div>
          <p style="color: #374151;">Vous pouvez soumettre un nouveau besoin en tenant compte des retours ci-dessus.</p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          InnovateBF — Thinktank pour la technologie endogene au Burkina Faso
        </p>
      </div>
    `,
  });
}

export async function sendRevisionRequestedEmail(params: {
  to: string;
  authorName: string;
  needTitle: string;
  needId: string;
  comment: string;
  siteUrl?: string;
}): Promise<void> {
  const url =
    params.siteUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://innovatebf.org";

  await sendEmail({
    to: params.to,
    subject: `Revision demandee pour votre besoin — ${params.needTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #d97706; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">InnovonsEnsembleLeFaso</h1>
        </div>
        <div style="padding: 32px; background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #111827;">Bonjour ${params.authorName},</h2>
          <p style="color: #374151;">Notre equipe a examine votre besoin et demande quelques <strong style="color: #d97706;">revisions</strong> avant publication.</p>
          <div style="background: #fffbeb; border-left: 4px solid #d97706; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <strong style="color: #92400e;">Besoin :</strong> ${params.needTitle}<br/>
            <strong style="color: #92400e; margin-top: 8px; display: block;">Demande de revision :</strong>
            <p style="color: #374151; margin: 4px 0 0;">${params.comment}</p>
          </div>
          <a href="${url}/innovons/mon-espace/besoins" style="display: inline-block; background: #d97706; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
            Reviser mon besoin
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          InnovateBF — Thinktank pour la technologie endogene au Burkina Faso
        </p>
      </div>
    `,
  });
}
