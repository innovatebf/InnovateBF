import { betterAuth } from "better-auth";
import { Pool } from "@neondatabase/serverless";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
  secret: process.env.BETTER_AUTH_SECRET,
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      if (resend) {
        await resend.emails.send({
          from: "InnovateBF <noreply@innovatebf.org>",
          to: user.email,
          subject: "Réinitialisation de votre mot de passe — InnovateBF",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
              <h2 style="color:#16a34a;margin-bottom:8px">InnovateBF</h2>
              <p style="color:#374151">Bonjour${user.name ? " " + user.name : ""},</p>
              <p style="color:#374151">Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe. Ce lien est valable 1 heure.</p>
              <a href="${url}" style="display:inline-block;margin:20px 0;padding:12px 24px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
                Réinitialiser mon mot de passe
              </a>
              <p style="color:#6b7280;font-size:13px">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
              <p style="color:#9ca3af;font-size:12px">InnovateBF — Innovation endogène au Burkina Faso</p>
            </div>
          `,
        });
      } else {
        // Fallback: log URL to console (dev without RESEND_API_KEY)
        console.log(`[Password Reset] To: ${user.email}, URL: ${url}`);
      }
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "guest",
        input: false, // not user-editable
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
});

export type Session = typeof auth.$Infer.Session;
