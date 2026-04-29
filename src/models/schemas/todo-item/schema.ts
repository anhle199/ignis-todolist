import { generateIdColumnDefs, generateTzColumnDefs, type TConstValue } from '@venizia/ignis';
import { bigint, index, pgTable, text, varchar } from 'drizzle-orm/pg-core';

export class TodoItemStatuses {
  static readonly TODO = '00TODO';
  static readonly INPROGRESS = '20INPROGRESS';
  static readonly COMPLETED = '40COMPLETED';
  static readonly CANCELLED = '50CANCELLED';

  static readonly SCHEME_SET = new Set([
    this.TODO,
    this.INPROGRESS,
    this.COMPLETED,
    this.CANCELLED,
  ]);

  static isValid(scheme: string): boolean {
    return this.SCHEME_SET.has(scheme);
  }
}

export type TTodoItemStatus = TConstValue<typeof TodoItemStatuses>;

// ----------------------------------------------------------------------------
export const TodoItemSchema = pgTable(
  'todo_item',
  {
    ...generateIdColumnDefs({ id: { dataType: 'big-number', numberMode: 'number' } }),
    ...generateTzColumnDefs(),
    code: varchar('code', { length: 30 }).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    status: varchar('status').notNull().default(TodoItemStatuses.TODO),
    todolistId: bigint('todolist_id', { mode: 'number' }).notNull(),
  },
  (def) => [index('idx_todo_item_todolist_id').on(def.todolistId)],
);
