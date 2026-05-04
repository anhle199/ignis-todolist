import { Todolist, TTodolist } from '@/models';
import { TodolistRepository } from '@/repositories';
import { TodolistService } from '@/services';
import { z } from '@hono/zod-openapi';
import {
  BindingKeys,
  BindingNamespaces,
  controller,
  ControllerFactory,
  inject,
  TWhere,
  type TRouteContext,
} from '@venizia/ignis';
import { HTTP } from '@venizia/ignis-helpers';

const BASE_PATH = '/todolists-crud';

const _TodolistCrudController = ControllerFactory.defineCrudController({
  repository: { name: TodolistRepository.name },
  controller: {
    name: 'TodolistCrudController',
    basePath: BASE_PATH,
    isStrict: { path: true, requestSchema: true },
  },
  entity: () => Todolist, // Provide a resolver for your entity class
  routes: {
    // deleteById: {
    //   // request: {
    //   //   params: BaseTodolistRequestParamSchema,
    //   // },
    //   response: {
    //     schema: z.object({ message: z.string() }),
    //   },
    // },
    deleteBy: {
      response: {
        schema: z.object({ message: z.string() }),
      },
    },
  },
});

@controller({ path: BASE_PATH })
export class TodolistCrudController extends _TodolistCrudController {
  constructor(
    @inject({
      key: BindingKeys.build({
        namespace: BindingNamespaces.REPOSITORY,
        key: TodolistRepository.name,
      }),
    })
    repository: TodolistRepository,

    @inject({
      key: BindingKeys.build({
        namespace: BindingNamespaces.SERVICE,
        key: TodolistService.name,
      }),
    })
    private _service: TodolistService,
  ) {
    super(repository);
  }

  override async deleteBy(opts: { context: TRouteContext }) {
    const { context } = opts;
    const where = context.req.valid<TWhere<TTodolist>>('query');

    await this._service.deleteTodolistBy({ where });

    return context.json({ message: 'success' }, HTTP.ResultCodes.RS_2.Ok);
  }
}
