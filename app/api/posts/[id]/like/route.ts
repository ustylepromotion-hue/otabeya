import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { rooms } from "../../../../../db/schema";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const roomId = Number(id);
  if (!Number.isInteger(roomId) || roomId < 1) return Response.json({ error: "Invalid room" }, { status: 400 });
  try {
    const [room] = await getDb().update(rooms).set({ likes: sql`${rooms.likes} + 1` }).where(eq(rooms.id, roomId)).returning({ likes: rooms.likes });
    if (!room) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(room);
  } catch {
    return Response.json({ error: "いいねを保存できませんでした" }, { status: 500 });
  }
}
