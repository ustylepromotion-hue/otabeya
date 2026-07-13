import { env } from "cloudflare:workers";

type StorageEnv = { ROOM_IMAGES?: R2Bucket };

export async function GET(_request: Request, context: { params: Promise<{ key: string }> }) {
  const storage = (env as unknown as StorageEnv).ROOM_IMAGES;
  if (!storage) return new Response("Not found", { status: 404 });
  const { key } = await context.params;
  const object = await storage.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}
