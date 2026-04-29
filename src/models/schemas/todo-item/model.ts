import {
  BaseEntity,
  model,
  RelationTypes,
  type TRelationConfig,
  type TTableInsert,
  type TTableObject,
} from '@venizia/ignis';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { TodolistSchema, type Todolist } from '../todolist';
import { TodoItemSchema } from './schema';

@model({ type: 'entity' })
export class TodoItem extends BaseEntity<typeof TodoItemSchema> {
  static override TABLE_NAME = 'todo_item';
  static override schema = TodoItemSchema;

  // Define relations using TRelationConfig array format
  static override relations = (): TRelationConfig[] => [
    {
      type: RelationTypes.ONE,
      name: 'todolist',
      schema: TodolistSchema,
      metadata: {
        fields: [TodoItemSchema.todolistId],
        references: [TodolistSchema.id],
      },
    },
  ];
}

export type TTodoItemSchema = typeof TodoItemSchema;
export type TTodoItem = TTableObject<TTodoItemSchema> & {
  todolist?: Todolist;
};
export type TTodoItemPersist = TTableInsert<TTodoItemSchema>;

export const TodoItemSelectSchema = createSelectSchema(TodoItemSchema);
export const TodoItemInsertSchema = createInsertSchema(TodoItemSchema);
export const TodoItemUpdateSchema = createUpdateSchema(TodoItemSchema);
