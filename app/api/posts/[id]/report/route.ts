import { and, count, eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { reports, rooms } from "../../../../../db/schema";
import { moderateText } from "../../../../../lib/room-ai";
import { jsonWithVisitor, visitorFrom } from "../../../../../lib/visitor";

const allowedReasons = new Set(["権利侵害", "嫌がらせ・差別", "成人向け・危険物", "スパム・宣伝", "その他"]);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const roomId = Number(id);
  if (!Number.isInteger(roomId) || roomId < 1) return Response.json({ error: "Invalid room" }, { status: 400 });

  try {
    const payload = await request.json() as { reason?: string; details?: string };
    const reason = String(payload.reason ?? "").trim();
    const details = String(payload.details ?? "").trim();
    if (!allowedReasons.has(reason) || details.length > 500) return Response.json({ error: "通報内容を確認してください" }, { status: 400 });
    if (details && await moderateText(details)) return Response.json({ error: "入力内容を確認してください" }, { status: 422 });

    const visitor = visitorFrom(request);
    const db = getDb();
    const inserted = await db.insert(reports).values({ roomId, visitorId: visitor.id, reason, details }).onConflictDoNothing().returning({ id: reports.id });
    const [summary] = await db.select({ total: count() }).from(reports).where(and(eq(reports.roomId, roomId), eq(reports.status, "open")));
    if ((summary?.total ?? 0) >= 5) await db.update(rooms).set({ status: "review" }).where(eq(rooms.id, roomId));

    return jsonWithVisitor({ received: true, duplicate: inserted.length === 0 }, visitor.cookie, { status: 201 });
  } catch {
    return Response.json({ error: "通報を受け付けられませんでした" }, { status: 500 });
  }
}
