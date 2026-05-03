import {
  TTodolist,
  type TCreateTodolistRequest,
  type TDefaultFindFilterExcludingWhereQuery,
  type TDefaultFindFilterQuery,
  type TSingleTodolistRequestParam,
} from '@/models';
import { TodolistRepository } from '@/repositories';
import { TodolistService } from '@/services';
import {
  api,
  BaseRestController,
  BindingKeys,
  BindingNamespaces,
  controller,
  inject,
  TWhere,
  type TRouteContext,
} from '@venizia/ignis';
import { HTTP, toBoolean } from '@venizia/ignis-helpers';
import { BASE_PATH, RouteConfigs } from './definitions';

@controller({ path: BASE_PATH })
export class TodolistController extends BaseRestController {
  constructor(
    @inject({
      key: BindingKeys.build({
        namespace: BindingNamespaces.REPOSITORY,
        key: TodolistRepository.name,
      }),
    })
    private _repository: TodolistRepository,

    @inject({
      key: BindingKeys.build({
        namespace: BindingNamespaces.SERVICE,
        key: TodolistService.name,
      }),
    })
    private _service: TodolistService,
  ) {
    super({ scope: TodolistController.name });
  }

  override binding() {}

  @api({ configs: RouteConfigs.FIND })
  async findTodolists(context: TRouteContext) {
    const { filter } = context.req.valid<TDefaultFindFilterQuery<TTodolist>>('query');
    const withCounting = toBoolean(context.req.header(HTTP.Headers.REQUEST_COUNT_DATA) ?? 'true');
    const result = await this._service.findTodolists({ filter, withCounting });

    const respData = withCounting ? result : result.data;
    return context.json(respData, HTTP.ResultCodes.RS_2.Created);
  }

  @api({ configs: RouteConfigs.FIND_BY_ID })
  async findTodolistById(context: TRouteContext) {
    const { id } = context.req.valid<TSingleTodolistRequestParam>('param');
    const { filter } = context.req.valid<TDefaultFindFilterExcludingWhereQuery<TTodolist>>('query');
    const result = await this._repository.findById({ id, filter });
    return context.json(result, HTTP.ResultCodes.RS_2.Created);
  }

  @api({ configs: RouteConfigs.CREATE })
  async createTodoItem(context: TRouteContext) {
    const data = context.req.valid<TCreateTodolistRequest>('json');
    const result = await this._service.createTodolist({ data });
    return context.json(result, HTTP.ResultCodes.RS_2.Created);
  }

  @api({ configs: RouteConfigs.UPDATE_BY_ID })
  async updateTodoItemById(context: TRouteContext) {
    const { id } = context.req.valid<TSingleTodolistRequestParam>('param');
    const data = context.req.valid<TCreateTodolistRequest>('json');
    const result = await this._service.updateTodolistById({ id, data });
    return context.json(result, HTTP.ResultCodes.RS_2.Ok);
  }

  @api({ configs: RouteConfigs.DELETE_BY_ID })
  async deleteTodoItemById(context: TRouteContext) {
    const { id } = context.req.valid<TSingleTodolistRequestParam>('param');
    await this._service.deleteTodolistById({ id });
    return context.json({ message: 'success' }, HTTP.ResultCodes.RS_2.Ok);
  }

  @api({ configs: RouteConfigs.DELETE_BATCH })
  async deleteBy(opts: { context: TRouteContext }) {
    const { context } = opts;
    const where = context.req.valid<TWhere<TTodolist>>('query');

    await this._service.deleteTodolistBy({ where });

    return context.json({ message: 'success' }, HTTP.ResultCodes.RS_2.Ok);
  }
}
