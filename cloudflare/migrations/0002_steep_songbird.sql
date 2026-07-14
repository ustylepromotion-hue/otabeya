CREATE TABLE `affiliate_clicks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_ref` text NOT NULL,
	`product_name` text NOT NULL,
	`query` text NOT NULL,
	`position` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `affiliate_clicks_room_ref_idx` ON `affiliate_clicks` (`room_ref`);