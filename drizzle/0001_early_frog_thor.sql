CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer NOT NULL,
	`handle` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `comments_room_id_idx` ON `comments` (`room_id`);--> statement-breakpoint
ALTER TABLE `rooms` ADD `ai_share_copy` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` ADD `ai_archetype` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` ADD `ai_tags` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` ADD `ai_detected_items` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` ADD `ai_scores` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` ADD `ai_products` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` ADD `ai_model` text DEFAULT 'local-fallback' NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` ADD `ai_llm` integer DEFAULT false NOT NULL;