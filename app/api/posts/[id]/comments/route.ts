import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { comments } from "../../../../../db/schema";
import { moderateText } from "../../../../../lib/room-ai";

function roomIdFrom(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const roomId = roomIdFrom(id);
  if (!roomId) return Response.json({ error: "Invalid room" }, { status: 400 });
  try {
    const rows = await getDb().select().from(comments).where(eq(comments.roomId, roomId)).orderBy(asc(comments.createdAt), asc(comments.id)).limit(80);
    return Response.json({ comments: rows });
  } catch {
    return Response.json({ error: "コメントを読み込めませんでした" }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const roomId = roomIdFrom(id);
  if (!roomId) return Response.json({ error: "Invalid room" }, { status: 400 });
  try {
    const payload = await request.json() as { handle?: string; body?: string };
    const handle = String(payload.handle ?? "").trim().replace(/^([^@])/, "@$1");
    const body = String(payload.body ?? "").trim();
    if (!handle || !body || handle.length > 32 || body.length > 300) return Response.json({ error: "コメント内容を確認してください" }, { status: 400 });
    if (await moderateText(`${handle}\n${body}`)) return Response.json({ error: "コミュニティガイドラインにより投稿できません" }, { status: 422 });
    const [comment] = await getDb().insert(comments).values({ roomId, handle, body }).returning();
    return Response.json({ comment }, { status: 201 });
  } catch {
    return Response.json({ error: "コメントを投稿できませんでした" }, { status: 500 });
  }
}
