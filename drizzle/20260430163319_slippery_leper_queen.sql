ALTER TABLE "todo_item" ADD CONSTRAINT "uniq_todo_item_code" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "todolist" ADD CONSTRAINT "uniq_todolist_code" UNIQUE("code");