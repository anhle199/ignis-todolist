import {
  BaseTodoItemRequestParamSchema,
  CreateTodoItemRequestSchema,
  SingleTodoItemRequestParamSchema,
  UpdateTodoItemRequestSchema,
} from '@/models/requests';
import { TodoItemSelectSchema } from '@/models/schemas';
import { z } from '@hono/zod-openapi';
import { jsonContent, jsonResponse, type IAuthRouteConfig } from '@venizia/ignis';
import { ErrorSchema, HTTP } from '@venizia/ignis-helpers';

export const BASE_PATH = '/todolists/:todolistId/items';

export const RouteConfigs: Record<string, IAuthRouteConfig> = {
  CREATE: {
    method: HTTP.Methods.POST,
    path: '',
    request: {
      params: BaseTodoItemRequestParamSchema,
      body: jsonContent({
        description: 'CreateTodoItemRequestSchema',
        schema: CreateTodoItemRequestSchema,
      }),
    },
    responses: {
      [HTTP.ResultCodes.RS_2.Created]: jsonContent({
        description: 'Created Successfully',
        schema: TodoItemSelectSchema,
      }),
      ['4xx | 5xx']: jsonContent({
        description: 'Error Schema',
        schema: ErrorSchema,
      }),
    },
  },
  UPDATE_BY_ID: {
    method: HTTP.Methods.PATCH,
    path: '/:todoItemId',
    request: {
      params: SingleTodoItemRequestParamSchema,
      body: jsonContent({
        description: 'UpdateTodoItemRequestSchema',
        schema: UpdateTodoItemRequestSchema,
      }),
    },
    responses: jsonResponse({
      description: 'Updated Successfully',
      schema: TodoItemSelectSchema,
    }),
  },
  DELETE_BY_ID: {
    method: HTTP.Methods.DELETE,
    path: '/:todoItemId',
    request: {
      params: SingleTodoItemRequestParamSchema,
    },
    responses: jsonResponse({
      description: 'Deleted Successfully',
      schema: z.object({ message: z.string() }),
    }),
  },
  DELETE_BATCH: {
    method: HTTP.Methods.DELETE,
    path: '/batch',
    request: {
      params: BaseTodoItemRequestParamSchema,
      body: jsonContent({
        description: 'UpdateTodoItemRequestSchema',
        schema: UpdateTodoItemRequestSchema,
      }),
    },
    responses: jsonResponse({
      description: 'Deleted Successfully',
      schema: z.object({ message: z.string() }),
    }),
  },
};
