import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable("rooms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  handle: text("handle").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  imageKey: text("image_key").notNull(),
  imageType: text("image_type").notNull(),
  items: text("items").notNull().default("[]"),
  aiScore: integer("ai_score").notNull(),
  aiCaption: text("ai_caption").notNull(),
  aiShareCopy: text("ai_share_copy").notNull().default(""),
  aiArchetype: text("ai_archetype").notNull().default(""),
  aiTags: text("ai_tags").notNull().default("[]"),
  aiDetectedItems: text("ai_detected_items").notNull().default("[]"),
  aiScores: text("ai_scores").notNull().default("{}"),
  aiProducts: text("ai_products").notNull().default("[]"),
  aiModel: text("ai_model").notNull().default("local-fallback"),
  aiLlm: integer("ai_llm", { mode: "boolean" }).notNull().default(false),
  likes: integer("likes").notNull().default(0),
  status: text("status").notNull().default("published"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  handle: text("handle").notNull(),
  body: text("body").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
}, (table) => [index("comments_room_id_idx").on(table.roomId)]);

export const affiliateClicks = sqliteTable("affiliate_clicks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomRef: text("room_ref").notNull(),
  productName: text("product_name").notNull(),
  query: text("query").notNull(),
  position: integer("position").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
}, (table) => [index("affiliate_clicks_room_ref_idx").on(table.roomRef)]);

export const roomLikes = sqliteTable("room_likes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  visitorId: text("visitor_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
}, (table) => [uniqueIndex("room_likes_room_visitor_uidx").on(table.roomId, table.visitorId)]);

export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  visitorId: text("visitor_id").notNull(),
  reason: text("reason").notNull(),
  details: text("details").notNull().default(""),
  status: text("status").notNull().default("open"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
}, (table) => [
  uniqueIndex("reports_room_visitor_uidx").on(table.roomId, table.visitorId),
  index("reports_room_status_idx").on(table.roomId, table.status),
]);
