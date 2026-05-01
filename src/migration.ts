import { EnvironmentKeys } from '@venizia/ignis';
import { applicationEnvironment, int, LoggerFactory } from '@venizia/ignis-helpers';
import { defineConfig } from 'drizzle-kit';

const logger = LoggerFactory.getLogger(['migrate']);

const databaseConfigs = {
  host: applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_POSTGRES_HOST),
  port: int(applicationEnvironment.get<number>(EnvironmentKeys.APP_ENV_POSTGRES_PORT)),
  database: applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_POSTGRES_DATABASE),
  user: applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_POSTGRES_USERNAME),
  password: applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_POSTGRES_PASSWORD),
  ssl: false,
};
logger.info(JSON.stringify(databaseConfigs));

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/models/schemas/schemas.ts',
  dbCredentials: databaseConfigs,
  schemaFilter: 'public',
  migrations: {
    prefix: 'timestamp',
    table: '__drizzle_migrations__',
    schema: 'public',
  },
  verbose: true,
});
