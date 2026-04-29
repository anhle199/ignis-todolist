import { LoggerFactory } from '@venizia/ignis-helpers';
import { Logger } from 'drizzle-orm';

const logger = LoggerFactory.getLogger(['DrizzleQueryLogger']);

export class DrizzleQueryLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    logger.for(this.logQuery.name).info('Sql: %s, Params: %j', query, params);
  }
}
