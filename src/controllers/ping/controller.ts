import { EnvironmentKeys } from '@/common';
import {
  api,
  BaseRestController,
  controller,
  type IControllerOptions,
  type TRouteContext,
} from '@venizia/ignis';
import { applicationEnvironment, HTTP } from '@venizia/ignis-helpers';
import { BASE_PATH, PingRouteConfigs } from './definitions';

// All routes in this controller will be under /api/hello (remember path.base: '/api')
@controller({ path: BASE_PATH })
export class PingController extends BaseRestController {
  constructor(opts: IControllerOptions) {
    super({ ...opts, scope: PingController.name });
  }

  // Override binding() to register custom routes via bindRoute() or defineRoute().
  // For decorator-based routes (@api, @get, @post), this can be empty.
  override binding() {}

  @api({ configs: PingRouteConfigs.ping })
  ping(c: TRouteContext) {
    const result = {
      applicationName: applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_APPLICATION_NAME),
      message: 'Ping',
      systemTimestamp: new Date().toISOString(),
    };
    return c.json(result, HTTP.ResultCodes.RS_2.Ok);
  }
}
