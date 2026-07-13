import { desc } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { rooms } from "../../../db/schema";

type StorageEnv = { ROOM_IMAGES?: R2Bucket };

export async function GET() {
  try {
    const rows = await getDb().select().from(rooms).where().orderBy(desc(rooms.createdAt)).limit(30);
    return Response.json({ rooms: rows.map((room) => ({ ...room, image: `/api/images/${encodeURIComponent(room.imageKey)}` })) });
  } catch {
    return Response.json({ error: "投稿一覧を読み込めませんでした" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const storage = (env as unknown as StorageEnv).ROOM_IMAGES;
    if (!storage) return Response.json({ error: "画像ストレージが利用できません" }, { status: 503 });

    const data = await request.formData();
    const image = data.get("image");
    const title = String(data.get("title") ?? "").trim();
    const handle = String(data.get("handle") ?? "").trim();
    const category = String(data.get("category") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const itemText = String(data.get("items") ?? "").trim();

    if (!(image instanceof File) || !title || !handle || !category || !description) {
      return Response.json({ error: "必須項目を入力してください" }, { status: 400 });
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size > 10 * 1024 * 1024) {
      return Response.json({ error: "JPG・PNG・WEBP（10MB以内）を選んでください" }, { status: 400 });
    }

    const imageKey = `${crypto.randomUUID()}.${image.type.split("/")[1]}`;
    await storage.put(imageKey, image.stream(), { httpMetadata: { contentType: image.type, cacheControl: "public, max-age=31536000, immutable" } });

    const seed = `${title}${description}${category}`.length;
    const aiScore = Math.min(99, 78 + (seed % 22));
    const aiCaption = `${category}への偏愛と、${description.slice(0, 28)}という設計思想を検出。見せたいポイントが一目で伝わる部屋です。`;
    const items = JSON.stringify(itemText.split(/[、,]/).map((item) => item.trim()).filter(Boolean));
    const [room] = await getDb().insert(rooms).values({ title, handle, category, description, imageKey, imageType: image.type, items, aiScore, aiCaption }).returning();

    return Response.json({ room: { ...room, image: `/api/images/${encodeURIComponent(imageKey)}` } }, { status: 201 });
  } catch {
    return Response.json({ error: "投稿を保存できませんでした" }, { status: 500 });
  }
}
