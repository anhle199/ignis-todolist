import { NUMBER_BOUNDS } from '@/common';
import { z } from '@hono/zod-openapi';

export const BaseTodolistRequestParamSchema = z.object({
  id: z.coerce.number().gt(0).max(NUMBER_BOUNDS.INT32.MAX),
});

export type TBaseTodolistRequestParam = z.infer<typeof BaseTodolistRequestParamSchema>;
