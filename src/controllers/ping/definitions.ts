import { z } from '@hono/zod-openapi';
import { jsonContent } from '@venizia/ignis';
import { HTTP } from '@venizia/ignis-helpers';

export const BASE_PATH = '/ping';

export const PingRouteConfigs = {
  ping: {
    method: HTTP.Methods.GET,
    path: '/',
    responses: {
      [HTTP.ResultCodes.RS_2.Ok]: jsonContent({
        description: 'pong pong pong',
        schema: z.object({
          applicationName: z.string(),
          message: z.string(),
          currentDatetime: z.iso.datetime(),
        }),
      }),
    },
  },
} as const;
