import { count, desc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { comments, rooms } from "../../../db/schema";
import { analyzeRoom, RoomSafetyError } from "../../../lib/room-ai";

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

export async function POST(request: Request) {
  const storage = (env as unknown as StorageEnv).ROOM_IMAGES;
  let storedKey = "";
  try {
    if (!storage) return Response.json({ error: "画像ストレージが利用できません" }, { status: 503 });
    const data = await request.formData();
    const image = data.get("image");
    const title = String(data.get("title") ?? "").trim();
    const handle = String(data.get("handle") ?? "").trim().replace(/^([^@])/, "@$1");
    const category = String(data.get("category") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const itemText = String(data.get("items") ?? "").trim();

    if (!(image instanceof File) || !title || !handle || !category || !description) {
      return Response.json({ error: "必須項目を入力してください" }, { status: 400 });
    }
    if (title.length > 80 || handle.length > 32 || description.length > 800 || itemText.length > 300) {
      return Response.json({ error: "入力文字数を確認してください" }, { status: 400 });
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size > 10 * 1024 * 1024) {
      return Response.json({ error: "JPG・PNG・WEBP（10MB以内）を選んでください" }, { status: 400 });
    }

    const analysis = await analyzeRoom(image, title, category, description, itemText);
    storedKey = `${crypto.randomUUID()}.${image.type.split("/")[1]}`;
    await storage.put(storedKey, image.stream(), { httpMetadata: { contentType: image.type, cacheControl: "public, max-age=31536000, immutable" } });

    const [room] = await getDb().insert(rooms).values({
      title, handle, category, description, imageKey: storedKey, imageType: image.type,
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
