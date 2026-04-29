import {
  BaseEntity,
  model,
  RelationTypes,
  type TRelationConfig,
  type TTableInsert,
  type TTableObject,
} from '@venizia/ignis';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { TodoItemSchema, type TTodoItem } from '../todo-item';
import { TodolistSchema } from './schema';

@model({ type: 'entity' })
export class Todolist extends BaseEntity<typeof TodolistSchema> {
  static override TABLE_NAME = 'todolist';
  static override schema = TodolistSchema;

  // Define relations using TRelationConfig array format
  static override relations = (): TRelationConfig[] => [
    {
      type: RelationTypes.MANY,
      name: 'items',
      schema: TodoItemSchema,
      metadata: {
        relationName: 'todolist',
      },
    },
  ];
}

export type TTodolistSchema = typeof TodolistSchema;
export type TTodolist = TTableObject<TTodolistSchema> & {
  items?: TTodoItem[];
};
export type TTodolistPersist = TTableInsert<TTodolistSchema>;

export const TodolistSelectSchema = createSelectSchema(TodolistSchema);
export const TodolistInsertSchema = createInsertSchema(TodolistSchema);
export const TodolistUpdateSchema = createUpdateSchema(TodolistSchema);
