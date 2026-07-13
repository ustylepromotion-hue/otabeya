CREATE TABLE `rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`handle` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`image_key` text NOT NULL,
	`image_type` text NOT NULL,
	`items` text DEFAULT '[]' NOT NULL,
	`ai_score` integer NOT NULL,
	`ai_caption` text NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
