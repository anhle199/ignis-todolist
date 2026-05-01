CREATE TABLE "todo_item" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "todo_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"code" varchar(30) NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" varchar DEFAULT '00TODO' NOT NULL,
	"todolist_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todolist" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "todolist_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"code" varchar(30) NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "todo_item" ADD CONSTRAINT "fk_todolist_id_todolist" FOREIGN KEY ("todolist_id") REFERENCES "public"."todolist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_todo_item_todolist_id" ON "todo_item" USING btree ("todolist_id");