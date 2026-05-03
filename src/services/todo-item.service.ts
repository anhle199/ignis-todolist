import type { TCreateTodoItemRequest, TUpdateTodoItemRequest } from '@/models/requests';
import type { TTodoItem } from '@/models/schemas';
import { TodoItemRepository, TodolistRepository } from '@/repositories';
import { BaseService, BindingKeys, BindingNamespaces, inject } from '@venizia/ignis';
import { getError, HTTP } from '@venizia/ignis-helpers';

export class TodoItemService extends BaseService {
  constructor(
    @inject({
      key: BindingKeys.build({
        namespace: BindingNamespaces.REPOSITORY,
        key: TodoItemRepository.name,
      }),
    })
    private _repository: TodoItemRepository,

    @inject({
      key: BindingKeys.build({
        namespace: BindingNamespaces.REPOSITORY,
        key: TodolistRepository.name,
      }),
    })
    private _todolistRepository: TodolistRepository,
  ) {
    super({ scope: TodoItemService.name });
  }

  async createTodoItem(opts: { data: TCreateTodoItemRequest }): Promise<TTodoItem> {
    const { data } = opts;
    const { code, todolistId } = data;

    const isExistedTodolist = await this._todolistRepository.existsWith({
      where: { id: todolistId },
    });
    if (!isExistedTodolist) {
      throw getError({
        message: 'Todolist not found',
        statusCode: HTTP.ResultCodes.RS_4.BadRequest,
      });
    }

    const isExistedTodoItem = await this._repository.existsWith({ where: { code } });
    if (isExistedTodoItem) {
      throw getError({
        message: `Todo item ${code} is already existed`,
        statusCode: HTTP.ResultCodes.RS_4.BadRequest,
      });
    }

    const createdResult = await this._repository.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        status: data.status,
        todolistId: data.todolistId as number,
      },
    });

    return createdResult.data;
  }

  async updateTodoItemById(opts: {
    data: TUpdateTodoItemRequest;
    todoItemId: number;
    todolistId: number;
  }): Promise<TTodoItem> {
    const { data, todolistId, todoItemId } = opts;

    const isExistedTodolist = await this._todolistRepository.existsWith({
      where: { id: todolistId },
    });
    if (!isExistedTodolist) {
      throw getError({
        message: 'Todolist not found',
        statusCode: HTTP.ResultCodes.RS_4.BadRequest,
      });
    }

    const isExistedTodoItem = await this._repository.existsWith({
      where: {
        id: todoItemId,
        todolistId,
      },
    });
    if (!isExistedTodoItem) {
      throw getError({
        message: `Todo item not found`,
        statusCode: HTTP.ResultCodes.RS_4.NotFound,
      });
    }

    const updatedResult = await this._repository.updateById({
      id: todoItemId,
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
      },
    });

    return updatedResult.data;
  }

  async deleteBatchTodoItems(opts: { todolistId: number; todoItemIds: number[] }): Promise<void> {
    const { todolistId, todoItemIds } = opts;
    const logger = this.logger.for(this.deleteBatchTodoItems.name);

    const isExistedTodolist = await this._todolistRepository.existsWith({
      where: { id: todolistId },
    });
    if (!isExistedTodolist) {
      throw getError({
        message: 'Todolist not found',
        statusCode: HTTP.ResultCodes.RS_4.BadRequest,
      });
    }

    const { count: todoItemCount } = await this._repository.count({
      where: {
        id: {
          inq: todoItemIds,
        },
        todolistId,
      },
    });

    if (todoItemCount !== todoItemIds.length) {
      throw getError({
        message: 'Some todo items are not found',
        statusCode: HTTP.ResultCodes.RS_4.BadRequest,
      });
    }

    const { count: deletedCount } = await this._repository.deleteBy({
      where: {
        id: {
          inq: todoItemIds,
        },
        todolistId,
      },
    });

    logger.info(`Deleted ${deletedCount} todo items with ids: ${todoItemIds}`);
  }
}
