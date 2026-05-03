import { NUMBER_BOUNDS } from '@/common';
import { z } from '@hono/zod-openapi';

export const SingleTodolistRequestParamSchema = z.object({
  id: z.coerce.number().gt(0).max(NUMBER_BOUNDS.INT32.MAX),
});

export type TSingleTodolistRequestParam = z.infer<typeof SingleTodolistRequestParamSchema>;

// ----------------------------------------------------------------------------
export const CreateTodolistRequestSchema = z.object({
  code: z.string().trim().min(1).max(30), // generated code
  name: z.string().trim().min(1),
  // items: []
});

export type TCreateTodolistRequest = z.infer<typeof CreateTodolistRequestSchema>;

// ----------------------------------------------------------------------------
export const UpdateTodolistRequestSchema = z.object({
  name: z.string().trim().min(1).optional(),
});

export type TUpdateTodolistRequest = z.infer<typeof UpdateTodolistRequestSchema>;

// ----------------------------------------------------------------------------
export const DeleteBatchTodolistsRequestSchema = z.object({
  ids: z
    .array(z.int32().gt(0))
    .min(1)
    .refine((lists) => new Set(lists).size === lists.length, {
      message: 'All lists in the array must be unique',
    }),
});

export type TDeleteBatchTodolistsRequest = z.infer<typeof DeleteBatchTodolistsRequestSchema>;
