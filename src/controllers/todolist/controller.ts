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
import { BASE_PATH } from './definitions';

const _TodolistController = ControllerFactory.defineCrudController({
  repository: { name: TodolistRepository.name },
  controller: {
    name: 'MerchantController',
    basePath: '/merchants',
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
export class TodolistController extends _TodolistController {
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
    private readonly _service: TodolistService,
  ) {
    super(repository);
  }

  // override async create(opts: { context: TRouteContext }) {
  //   const logger = this.logger.for(this.create.name);
  //   logger.info('override create method');

  //   const { context } = opts;

  //   const body = context.req.valid<TCreateMerchantRequest>('json');
  //   const result = await this._service.createMerchant({ data: body });

  //   return context.json(result, HTTP.ResultCodes.RS_2.Created);
  // }

  // override async deleteById(opts: { context: TRouteContext }) {
  //   const { context } = opts;
  //   const { id } = context.req.valid<TBaseTodolistRequestParam>('param');

  //   await this.repository.deleteById({ id });

  //   return context.json({ message: 'success' }, HTTP.ResultCodes.RS_2.Ok);
  // }

  override async deleteBy(opts: { context: TRouteContext }) {
    const { context } = opts;
    const where = context.req.valid<TWhere<TTodolist>>('query');

    await this._service.deleteTodolistBy({ where });

    return context.json({ message: 'success' }, HTTP.ResultCodes.RS_2.Ok);
  }
}
