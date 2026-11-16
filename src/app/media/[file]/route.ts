import { readLocalMedia } from "@/server/media";

/** GET /media/:file : images de la médiathèque stockées sur disque (développement / auto-hébergement). */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const file = await readLocalMedia((await params).file);
  if (!file) return new Response("Introuvable", { status: 404 });
  return new Response(new Uint8Array(file.buf), {
    headers: {
      "Content-Type": file.type,
      "Content-Length": String(file.buf.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
