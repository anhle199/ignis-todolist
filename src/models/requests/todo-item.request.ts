import { NUMBER_BOUNDS } from '@/common';
import { z } from '@hono/zod-openapi';
import { TodoItemStatuses } from '../schemas';

export const BaseTodoItemRequestParamSchema = z.object({
  todolistId: z.coerce.number().gt(0).max(NUMBER_BOUNDS.INT32.MAX),
});

export type TBaseTodoItemRequestParam = z.infer<typeof BaseTodoItemRequestParamSchema>;

// ----------------------------------------------------------------------------
export const SingleTodoItemRequestParamSchema = BaseTodoItemRequestParamSchema.extend({
  todoItemId: z.coerce.number().gt(0).max(NUMBER_BOUNDS.INT32.MAX),
});

export type TSingleTodoItemRequestParam = z.infer<typeof SingleTodoItemRequestParamSchema>;

// ----------------------------------------------------------------------------
export const CreateTodoItemRequestSchema = z.object({
  code: z.string().trim().min(1).max(30), // generated code
  name: z.string().trim().min(1),
  description: z.string().trim().nullish(),
  status: z.enum([...TodoItemStatuses.SCHEME_SET]),
  todolistId: z.int32().gt(0).nullish(),
});

export type TCreateTodoItemRequest = z.infer<typeof CreateTodoItemRequestSchema>;

// ----------------------------------------------------------------------------
export const UpdateTodoItemRequestSchema = z
  .object({
    name: z.string().trim().min(1),
    description: z.string().trim().nullish(),
    status: z.enum([...TodoItemStatuses.SCHEME_SET]),
  })
  .partial();

export type TUpdateTodoItemRequest = z.infer<typeof UpdateTodoItemRequestSchema>;

// ----------------------------------------------------------------------------
export const DeleteBatchTodoItemsRequestSchema = z.object({
  ids: z
    .array(z.int32().gt(0))
    .min(1)
    .refine((items) => new Set(items).size === items.length, {
      message: 'All items in the array must be unique',
    }),
});

export type TDeleteBatchTodoItemsRequest = z.infer<typeof DeleteBatchTodoItemsRequestSchema>;
