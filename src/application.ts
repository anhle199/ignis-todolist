import {
  BaseApplication,
  CoreBindings,
  IApplicationConfigs,
  IApplicationInfo,
  SwaggerComponent,
  ValueOrPromise,
} from '@venizia/ignis';
import { Environment } from '@venizia/ignis-helpers';
import packageJson from '../package.json';
import { PingController } from './controllers';

// Define application configurations
export const appConfigs: IApplicationConfigs = {
  host: process.env.APP_ENV_SERVER_HOST,
  port: Number(process.env.APP_ENV_SERVER_PORT),
  path: {
    base: process.env.APP_ENV_SERVER_BASE_PATH!,
    isStrict: true,
  },
  debug: {
    shouldShowRoutes: process.env.NODE_ENV !== Environment.PRODUCTION,
  },
  bootOptions: {},
  error: { rootKey: 'error' },
};

export class Application extends BaseApplication {
  override getProjectRoot(): string {
    const projectRoot = __dirname;
    this.bind<string>({ key: CoreBindings.APPLICATION_PROJECT_ROOT }).toValue(projectRoot);
    return projectRoot;
  }

  // Required: Tell the framework about your app (used for API docs)
  override getAppInfo(): ValueOrPromise<IApplicationInfo> {
    return packageJson;
  }

  // Hook 1: Configure static file serving (e.g., serve images from /public)
  staticConfigure(): void {}

  // Hook 2: Add global middlewares (CORS, etc.)
  override async setupMiddlewares(): Promise<void> {
    const server = this.getServer();
    const { cors } = await import('hono/cors');

    server.use(
      '*',
      cors({
        origin: '*',
        allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        maxAge: 86_400,
        credentials: true,
      }),
    );
  }

  // Hook 3: Register your resources (THIS IS THE MOST IMPORTANT ONE)
  preConfigure(): ValueOrPromise<void> {
    // Register SwaggerComponent for API documentation at /doc/explorer
    this.component(SwaggerComponent);

    // As your app grows, you'll add:
    // this.dataSource(DataSourceClass);
    // this.repository(RepositoryClass);

    // this.service(UserService);
    // this.component(AuthComponent);

    // Register our controller
    this.controller(PingController);
  }

  // Hook 4: Do cleanup or extra work after everything is set up
  postConfigure(): ValueOrPromise<void> {
    // Example: Seed database, start background jobs, etc.
  }
}
