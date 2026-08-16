import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");

const FROM = "InnovateBF <noreply@resend.dev>";

interface AccuseParams {
  to: string;
  dossierNumero: string;
  suiviUrl: string;
  langue: "fr" | "en";
}

export async function envoyerAccuse({ to, dossierNumero, suiviUrl, langue }: AccuseParams) {
  const subject =
    langue === "fr"
      ? `Accusé de réception — Candidature EBC'26 ${dossierNumero}`
      : `Acknowledgement — EBC'26 Application ${dossierNumero}`;

  const html =
    langue === "fr"
      ? `<p>Bonjour,</p>
         <p>Votre candidature EBC'26 a bien été reçue.</p>
         <p><strong>Numéro de dossier :</strong> ${dossierNumero}</p>
         <p><a href="${suiviUrl}">Suivre votre dossier</a></p>
         <p>Vous pouvez compléter des pièces manquantes dans les 72 heures suivant la soumission.</p>
         <p>Dates de la conférence : 13–14 novembre 2026, CEA-UNB, Bobo-Dioulasso.</p>`
      : `<p>Hello,</p>
         <p>Your EBC'26 application has been received.</p>
         <p><strong>Reference number:</strong> ${dossierNumero}</p>
         <p><a href="${suiviUrl}">Track your application</a></p>
         <p>You may add missing documents within 72 hours of submission.</p>
         <p>Conference dates: 13–14 November 2026, CEA-UNB, Bobo-Dioulasso.</p>`;

  await getResend().emails.send({ from: FROM, to, subject, html });
}
