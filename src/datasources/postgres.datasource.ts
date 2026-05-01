import { EnvironmentKeys } from '@/common';
import { DrizzleQueryLogger } from '@/helpers';
import { BaseDataSource, datasource } from '@venizia/ignis';
import { applicationEnvironment, int, ValueOrPromise } from '@venizia/ignis-helpers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

interface IPostgresDataSourceSettings {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  useSSL: boolean;
}

@datasource({ driver: 'node-postgres' })
export class PostgresDataSource extends BaseDataSource<IPostgresDataSourceSettings> {
  constructor() {
    super({
      name: PostgresDataSource.name,
      config: {
        host: applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_POSTGRES_HOST),
        port: int(applicationEnvironment.get<number>(EnvironmentKeys.APP_ENV_POSTGRES_PORT)),
        database: applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_POSTGRES_DATABASE),
        user: applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_POSTGRES_USERNAME),
        password: applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_POSTGRES_PASSWORD),
        useSSL: false,
      },
    });
  }

  // ---------------------------------------------------------------------------
  override configure(): ValueOrPromise<void> {
    const logger = this.logger.for(this.configure.name);
    // getSchema() auto-discovers models from @repository bindings
    const schema = this.getSchema();

    const dsSchema = Object.keys(schema);
    logger.debug('Auto-discovered schema | Schema + Relations (%s): %o', dsSchema.length, dsSchema);

    const isShowSql = applicationEnvironment.get<boolean>(EnvironmentKeys.APP_ENV_DRIZZLE_SHOW_SQL);
    const queryLogger = isShowSql ? new DrizzleQueryLogger() : undefined;

    // Store pool reference for transaction support
    this.pool = new Pool(this.settings);
    this.connector = drizzle({ client: this.pool, schema, logger: queryLogger });
  }

  // ---------------------------------------------------------------------------
  override getConnectionString(): ValueOrPromise<string> {
    const { host, port, database, user, password, useSSL } = this.settings;
    return `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=${
      useSSL ? 'require' : 'disable'
    }`;
  }
}
