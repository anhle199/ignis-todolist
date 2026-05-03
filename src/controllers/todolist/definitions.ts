import {
  CreateTodolistRequestSchema,
  DefaultFindFilterExcludingWhereSchemaQuery,
  DefaultFindFilterSchemaQuery,
  SingleTodolistRequestParamSchema,
  TodolistSelectSchema,
  UpdateTodolistRequestSchema,
} from '@/models';
import { z } from '@hono/zod-openapi';
import {
  conditionalCountResponse,
  jsonContent,
  jsonResponse,
  type IAuthRouteConfig,
} from '@venizia/ignis';
import { ErrorSchema, HTTP } from '@venizia/ignis-helpers';

export const BASE_PATH = '/todolists';

export const RouteConfigs: Record<string, IAuthRouteConfig> = {
  FIND: {
    method: HTTP.Methods.GET,
    path: '',
    request: {
      query: DefaultFindFilterSchemaQuery,
    },
    responses: {
      [HTTP.ResultCodes.RS_2.Created]: jsonContent({
        description: 'Array of matching records (with optional count)',
        schema: conditionalCountResponse(z.array(TodolistSelectSchema)),
      }),
      ['4xx | 5xx']: jsonContent({
        description: 'Error Schema',
        schema: ErrorSchema,
      }),
    },
  },
  FIND_BY_ID: {
    method: HTTP.Methods.GET,
    path: '/:id',
    request: {
      params: SingleTodolistRequestParamSchema,
      query: DefaultFindFilterExcludingWhereSchemaQuery,
    },
    responses: {
      [HTTP.ResultCodes.RS_2.Created]: jsonContent({
        description: 'Single record matching ID or null',
        schema: conditionalCountResponse(TodolistSelectSchema),
      }),
      ['4xx | 5xx']: jsonContent({
        description: 'Error Schema',
        schema: ErrorSchema,
      }),
    },
  },
  CREATE: {
    method: HTTP.Methods.POST,
    path: '',
    request: {
      body: jsonContent({
        description: 'CreateTodolistRequestSchema',
        schema: CreateTodolistRequestSchema,
      }),
    },
    responses: {
      [HTTP.ResultCodes.RS_2.Created]: jsonContent({
        description: 'Created Successfully',
        schema: TodolistSelectSchema,
      }),
      ['4xx | 5xx']: jsonContent({
        description: 'Error Schema',
        schema: ErrorSchema,
      }),
    },
  },
  UPDATE_BY_ID: {
    method: HTTP.Methods.PATCH,
    path: '/:id',
    request: {
      params: SingleTodolistRequestParamSchema,
      body: jsonContent({
        description: 'UpdateTodolistRequestSchema',
        schema: UpdateTodolistRequestSchema,
      }),
    },
    responses: jsonResponse({
      description: 'Updated Successfully',
      schema: TodolistSelectSchema,
    }),
  },
  DELETE_BY_ID: {
    method: HTTP.Methods.DELETE,
    path: '/:id',
    request: {
      params: SingleTodolistRequestParamSchema,
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
      body: jsonContent({
        description: 'UpdateTodolistRequestSchema',
        schema: UpdateTodolistRequestSchema,
      }),
    },
    responses: jsonResponse({
      description: 'Deleted Successfully',
      schema: z.object({ message: z.string() }),
    }),
  },
};
