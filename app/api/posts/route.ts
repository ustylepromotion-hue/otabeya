import { count, desc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { comments, rooms } from "../../../db/schema";
import { analyzeRoom, RoomSafetyError } from "../../../lib/room-ai";
import { storeRemoteImage } from "../../../lib/r2";

type StorageEnv = { ROOM_IMAGES?: R2Bucket };

function parseJson<T>(value: string, fallback: T): T {
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

function publicRoom(room: typeof rooms.$inferSelect, commentCount = 0) {
  return {
    id: room.id,
    title: room.title,
    handle: room.handle,
    category: room.category,
    description: room.description,
    image: `/api/images/${encodeURIComponent(room.imageKey)}`,
    likes: room.likes,
    commentCount,
    createdAt: room.createdAt,
    analysis: {
      score: room.aiScore,
      caption: room.aiCaption,
      shareCopy: room.aiShareCopy,
      archetype: room.aiArchetype,
      tags: parseJson<string[]>(room.aiTags, []),
      detectedItems: parseJson<string[]>(room.aiDetectedItems, []),
      scores: parseJson<Record<string, number>>(room.aiScores, {}),
      products: parseJson<{ name: string; query: string; reason: string }[]>(room.aiProducts, []),
      model: room.aiModel,
      llm: room.aiLlm,
    },
  };
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.select().from(rooms).where(eq(rooms.status, "published")).orderBy(desc(rooms.createdAt), desc(rooms.id)).limit(30);
    const commentCounts = await db.select({ roomId: comments.roomId, total: count() }).from(comments).groupBy(comments.roomId);
    const counts = new Map(commentCounts.map((entry) => [entry.roomId, entry.total]));
    return Response.json({ rooms: rows.map((room) => publicRoom(room, counts.get(room.id) ?? 0)) });
  } catch {
    return Response.json({ error: "投稿一覧を読み込めませんでした" }, { status: 500 });
  }
}

// NOTE: This endpoint intentionally uses request.json() instead of
// request.formData(). On the vinext-on-Workers runtime, materializing values
// from request.formData() (calling .get()/.entries()/reading file bodies)
// crashes the request connection and yields an empty response. JSON avoids it.
export async function POST(request: Request) {
  const storage = (env as unknown as StorageEnv).ROOM_IMAGES;
  let storedKey = "";
  try {
    if (!storage) return Response.json({ error: "画像ストレージが利用できません" }, { status: 503 });

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return Response.json({ error: "リクエスト形式が正しくありません。" }, { status: 400 });
    }

    const generatedKey = typeof body.generatedImageKey === "string" ? body.generatedImageKey : "";
    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : "";
    const imageType = typeof body.imageType === "string" ? body.imageType : "";
    const title = String(body.title ?? "").trim();
    const handle = String(body.handle ?? "").trim().replace(/^([^@])/, "@$1");
    const category = String(body.category ?? "").trim();
    const description = String(body.description ?? "").trim();
    const itemText = String(body.items ?? "").trim();

    if (!title || !handle || !category || !description) {
      return Response.json({ error: "必須項目を入力してください" }, { status: 400 });
    }
    if (title.length > 80 || handle.length > 32 || description.length > 800 || itemText.length > 300) {
      return Response.json({ error: "入力文字数を確認してください" }, { status: 400 });
    }

    let imageFile: File;
    let finalImageType: string;

    if (typeof generatedKey === "string" && generatedKey) {
      // fal 生成画像の場合：R2 上の既存キーを再利用する（fal の一時 URL は保存しない）。
      const existing = await storage.get(generatedKey);
      if (!existing) return Response.json({ error: "生成画像が見つかりません。もう一度生成してください" }, { status: 400 });
      const buffer = Buffer.from(await existing.arrayBuffer());
      const ext = (existing.httpContentType?.split("/")[1] || "png").replace(/[^a-z0-9]/gi, "png");
      finalImageType = /^(image\/(png|jpeg|webp))$/.test(existing.httpContentType ?? "") ? (existing.httpContentType as string) : `image/${ext}`;
      imageFile = new File([buffer], `${generatedKey}.${ext}`, { type: finalImageType });
    } else if (imageBase64 && ALLOWED_IMAGE_TYPES.has(imageType)) {
      const cleanBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
      const binary = Uint8Array.from(atob(cleanBase64), (c) => c.charCodeAt(0));
      if (binary.byteLength > 10 * 1024 * 1024) {
        return Response.json({ error: "JPG・PNG・WEBP（10MB以内）を選んでください" }, { status: 400 });
      }
      const ext = imageType.split("/")[1];
      finalImageType = imageType;
      imageFile = new File([binary], `upload.${ext}`, { type: imageType });
    } else {
      return Response.json({ error: "部屋の写真を選ぶか、AIで生成してください" }, { status: 400 });
    }

    const analysis = await analyzeRoom(imageFile, title, category, description, itemText);
    storedKey = `${crypto.randomUUID()}.${finalImageType.split("/")[1]}`;
    if (typeof generatedKey === "string" && generatedKey && generatedKey !== storedKey) {
      // 生成画像を新しいキーで複製して恒久保存。元の生成キーは掃除する。
      await storage.put(storedKey, imageFile.stream(), { httpMetadata: { contentType: finalImageType, cacheControl: "public, max-age=31536000, immutable" } });
      await storage.delete(generatedKey).catch(() => undefined);
    } else {
      await storage.put(storedKey, imageFile.stream(), { httpMetadata: { contentType: finalImageType, cacheControl: "public, max-age=31536000, immutable" } });
    }

    const [room] = await getDb().insert(rooms).values({
      title, handle, category, description, imageKey: storedKey, imageType: finalImageType,
      items: JSON.stringify(itemText.split(/[、,]/).map((item) => item.trim()).filter(Boolean)),
      aiScore: analysis.score, aiCaption: analysis.caption, aiShareCopy: analysis.shareCopy,
      aiArchetype: analysis.archetype, aiTags: JSON.stringify(analysis.tags),
      aiDetectedItems: JSON.stringify(analysis.detectedItems), aiScores: JSON.stringify(analysis.scores),
      aiProducts: JSON.stringify(analysis.products), aiModel: analysis.model, aiLlm: analysis.llm,
    }).returning();

    return Response.json({ room: publicRoom(room) }, { status: 201 });
  } catch (error) {
    if (storedKey && storage) await storage.delete(storedKey).catch(() => undefined);
    if (error instanceof RoomSafetyError) return Response.json({ error: error.message }, { status: 422 });
    return Response.json({ error: "投稿を保存できませんでした。時間を置いて再度お試しください" }, { status: 500 });
  }
}
