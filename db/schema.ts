import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  likes: integer("likes").notNull().default(0),
  status: text("status").notNull().default("published"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});
