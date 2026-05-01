import { generateIdColumnDefs, generateTzColumnDefs } from '@venizia/ignis';
import { pgTable, text, unique, varchar } from 'drizzle-orm/pg-core';

export const TodolistSchema = pgTable(
  'todolist',
  {
    ...generateIdColumnDefs({ id: { dataType: 'number' } }),
    ...generateTzColumnDefs(),
    code: varchar('code', { length: 30 }).notNull(),
    name: text('name').notNull(),
  },
  (def) => [unique('uniq_todolist_code').on(def.code)],
);
