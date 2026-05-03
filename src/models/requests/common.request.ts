import { z } from '@hono/zod-openapi';
import {
  FieldsSchema,
  InclusionSchema,
  LimitSchema,
  OffsetSchema,
  OrderBySchema,
  FilterSchema as OriginalFilterSchema,
  SkipSchema,
  type TFilter,
} from '@venizia/ignis';

const _FilterSchemaExcludingWhere = z.object({
  fields: FieldsSchema,
  include: InclusionSchema,
  order: OrderBySchema,
  limit: LimitSchema,
  offset: OffsetSchema,
  skip: SkipSchema,
});

export const FilterSchemaExcludingWhere = z
  .union([
    _FilterSchemaExcludingWhere,
    z
      .string()
      .transform((val) => {
        if (val) {
          return JSON.parse(val);
        }

        return {};
      })
      .pipe(_FilterSchemaExcludingWhere),
  ])
  .optional()
  .openapi({
    type: 'object',
    description:
      'A comprehensive filter object for querying data, including field selection, relations, pagination, and sorting.',
    examples: [
      JSON.stringify({ limit: 10 }),
      JSON.stringify({ fields: { id: true, name: true, email: true }, order: ['createdAt DESC'] }),
      JSON.stringify({ include: [{ relation: 'posts', scope: { limit: 5 } }] }),
      JSON.stringify({ skip: 20, limit: 10 }),
    ],
  });

// -----------------------------------------------------------------------------
export const DefaultFindFilterSchemaQuery = z.object({ filter: OriginalFilterSchema }).openapi({
  description: 'Filter with where, fields, limit, skip, order, include',
});

export type TDefaultFindFilterQuery<T> = { filter: TFilter<T> };

// -----------------------------------------------------------------------------
export const DefaultFindFilterExcludingWhereSchemaQuery = z
  .object({ filter: FilterSchemaExcludingWhere })
  .openapi({
    description: 'Filter with where, fields, limit, skip, order, include',
  });

export type TDefaultFindFilterExcludingWhereQuery<T> = { filter: Omit<TFilter<T>, 'where'> };
