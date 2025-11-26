ALTER TABLE "users" ADD COLUMN "auto_backup_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_backup_at" timestamp;