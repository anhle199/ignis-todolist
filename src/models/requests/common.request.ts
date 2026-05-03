import { z } from '@hono/zod-openapi';
import {
  FieldsSchema,
  InclusionSchema,
  LimitSchema,
  OffsetSchema,
  OrderBySchema,
  SkipSchema,
  WhereSchema,
  type TFilter,
} from '@venizia/ignis';

const _FilterSchema = z.object({
  where: WhereSchema.optional(),
  fields: FieldsSchema,
  include: InclusionSchema,
  order: OrderBySchema,
  limit: LimitSchema,
  offset: OffsetSchema,
  skip: SkipSchema,
});

/** Comprehensive Zod schema for repository query filtering. Supports object and JSON string formats. */
export const FilterSchema = z
  .union([
    _FilterSchema,
    z
      .string()
      .transform((val) => {
        if (val) {
          return JSON.parse(val);
        }

        return {};
      })
      .pipe(_FilterSchema),
  ])
  .optional()
  .openapi({
    type: 'object',
    description:
      'A comprehensive filter object for querying data, including conditions, field selection, relations, pagination, and sorting.',
    examples: [
      JSON.stringify({ where: { name: 'John Doe' }, limit: 10 }),
      JSON.stringify({ fields: { id: true, name: true, email: true }, order: ['createdAt DESC'] }),
      JSON.stringify({ include: [{ relation: 'posts', scope: { limit: 5 } }] }),
      JSON.stringify({
        where: { or: [{ status: 'active' }, { isPublished: true }] },
        skip: 20,
        limit: 10,
      }),
      JSON.stringify({ where: { and: [{ role: 'admin' }, { createdAt: { gte: 'YYYY-MM-DD' } }] } }),
    ],
  });

export const FilterSchemaExcludingWhere = z
  .union([
    _FilterSchema.omit({ where: true }),
    z
      .string()
      .transform((val) => {
        if (val) {
          return JSON.parse(val);
        }

        return {};
      })
      .pipe(_FilterSchema),
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
export const DefaultFindFilterSchemaQuery = z.object({ filter: FilterSchema }).openapi({
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
