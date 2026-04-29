import { generateIdColumnDefs, generateTzColumnDefs } from '@venizia/ignis';
import { pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const TodolistSchema = pgTable(
  'todolist',
  {
    ...generateIdColumnDefs({ id: { dataType: 'big-number', numberMode: 'number' } }),
    ...generateTzColumnDefs(),
    code: varchar('code', { length: 30 }).notNull(),
    name: text('name').notNull(),
  },
  () => [],
);
