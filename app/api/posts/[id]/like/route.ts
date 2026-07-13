import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { roomLikes, rooms } from "../../../../../db/schema";
import { jsonWithVisitor, visitorFrom } from "../../../../../lib/visitor";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const roomId = Number(id);
  if (!Number.isInteger(roomId) || roomId < 1) return Response.json({ error: "Invalid room" }, { status: 400 });
  try {
    const visitor = visitorFrom(request);
    const db = getDb();
    const [currentRoom] = await db.select({ likes: rooms.likes }).from(rooms).where(eq(rooms.id, roomId)).limit(1);
    if (!currentRoom) return Response.json({ error: "Not found" }, { status: 404 });
    const inserted = await db.insert(roomLikes).values({ roomId, visitorId: visitor.id }).onConflictDoNothing().returning({ id: roomLikes.id });
    const [room] = inserted.length
      ? await db.update(rooms).set({ likes: sql`${rooms.likes} + 1` }).where(eq(rooms.id, roomId)).returning({ likes: rooms.likes })
      : [currentRoom];
    return jsonWithVisitor({ ...room, liked: Boolean(inserted.length) }, visitor.cookie);
  } catch {
    return Response.json({ error: "いいねを保存できませんでした" }, { status: 500 });
  }
}
