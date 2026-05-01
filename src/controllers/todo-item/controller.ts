import {
  TBaseTodoItemRequestParam,
  TCreateTodoItemRequest,
  type TDeleteBatchTodoItemsRequest,
  type TSingleTodoItemRequestParam,
} from '@/models';
import { TodoItemService } from '@/services';
import {
  api,
  BaseRestController,
  BindingKeys,
  BindingNamespaces,
  controller,
  inject,
  type TRouteContext,
} from '@venizia/ignis';
import { HTTP } from '@venizia/ignis-helpers';
import { BASE_PATH, RouteConfigs } from './definitions';

@controller({ path: BASE_PATH })
export class TodoItemController extends BaseRestController {
  constructor(
    @inject({
      key: BindingKeys.build({
        namespace: BindingNamespaces.SERVICE,
        key: TodoItemService.name,
      }),
    })
    private _todoItemService: TodoItemService,
  ) {
    super({ scope: TodoItemController.name });
  }

  override binding() {}

  @api({ configs: RouteConfigs.CREATE })
  async createTodoItem(context: TRouteContext) {
    const logger = this.logger.for(this.createTodoItem.name);

    const { todolistId } = context.req.valid<TBaseTodoItemRequestParam>('param');
    const data = context.req.valid<TCreateTodoItemRequest>('json');

    data.todolistId = todolistId;
    logger.info(`reassign requestBody.todolistId = ${todolistId} (from request param)`);

    const result = await this._todoItemService.createTodoItem({ data });

    return context.json(result, HTTP.ResultCodes.RS_2.Created);
  }

  @api({ configs: RouteConfigs.UPDATE_BY_ID })
  async updateTodoItemById(context: TRouteContext) {
    const { todolistId, todoItemId } = context.req.valid<TSingleTodoItemRequestParam>('param');
    const data = context.req.valid<TCreateTodoItemRequest>('json');

    const result = await this._todoItemService.updateTodoItemById({
      data,
      todolistId,
      todoItemId,
    });

    return context.json(result, HTTP.ResultCodes.RS_2.Ok);
  }

  @api({ configs: RouteConfigs.DELETE_BY_ID })
  async deleteTodoItemById(context: TRouteContext) {
    const { todolistId, todoItemId } = context.req.valid<TSingleTodoItemRequestParam>('param');

    await this._todoItemService.deleteBatchTodoItems({
      todolistId,
      todoItemIds: [todoItemId],
    });

    return context.json({ message: 'success' }, HTTP.ResultCodes.RS_2.Ok);
  }

  @api({ configs: RouteConfigs.DELETE_BATCH })
  async deleteBatchTodoItems(context: TRouteContext) {
    const { todolistId } = context.req.valid<TBaseTodoItemRequestParam>('param');
    const data = context.req.valid<TDeleteBatchTodoItemsRequest>('json');

    await this._todoItemService.deleteBatchTodoItems({
      todolistId,
      todoItemIds: data.ids,
    });

    return context.json({ message: 'success' }, HTTP.ResultCodes.RS_2.Ok);
  }
}
