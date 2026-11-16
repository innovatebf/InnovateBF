import { limit } from "@/server/auth/rate-limit";
import { assertSameOrigin, clientIp, handler, json, readJson, requestLocale } from "@/server/http";
import { contactSchema, createMessage, isBot } from "@/server/submissions";

/** POST /api/public/contact : message du formulaire de contact. */
export const POST = handler(async (req) => {
  assertSameOrigin(req);
  await limit(`contact:${clientIp(req)}`, 5, 600);
  const input = await readJson(req, contactSchema, 16 * 1024);
  if (!isBot(input)) await createMessage(input);
  const message =
    requestLocale(req) === "en"
      ? "Thank you. Your message has been sent and we will get back to you shortly."
      : "Merci, votre message a bien été envoyé. Nous vous répondrons rapidement.";
  return json({ ok: true, message }, { status: 201 });
});
