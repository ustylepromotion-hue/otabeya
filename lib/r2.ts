import { env } from "cloudflare:workers";

export type StorageEnv = { ROOM_IMAGES?: R2Bucket };

// fal の一時 URL を fetch して R2 に保存する。
// 一時 URL をそのまま投稿画像として保存しないための恒久化ステップ。
export async function storeRemoteImage(
  remoteUrl: string,
  contentType: string,
): Promise<{ key: string; contentType: string }> {
  const storage = (env as unknown as StorageEnv).ROOM_IMAGES;
  if (!storage) throw new Error("画像ストレージが利用できません");

  const upstream = await fetch(remoteUrl);
  if (!upstream.ok || !upstream.body) {
    throw new Error("生成画像の取得に失敗しました。");
  }

  const ext = (contentType.split("/")[1] || "png").replace(/[^a-z0-9]/gi, "png");
  const key = `${crypto.randomUUID()}.${ext}`;
  const finalType = /^(image\/(png|jpeg|webp))$/.test(contentType)
    ? contentType
    : `image/${ext}`;

  await storage.put(key, upstream.body, {
    httpMetadata: { contentType: finalType, cacheControl: "public, max-age=31536000, immutable" },
  });

  return { key, contentType: finalType };
}
