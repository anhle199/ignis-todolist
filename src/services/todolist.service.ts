import type { TTodolist } from '@/models';
import { TodoItemRepository, TodolistRepository } from '@/repositories';
import { BaseService, BindingKeys, BindingNamespaces, inject, type TWhere } from '@venizia/ignis';
import { getError, HTTP } from '@venizia/ignis-helpers';

export class TodolistService extends BaseService {
  constructor(
    @inject({
      key: BindingKeys.build({
        namespace: BindingNamespaces.REPOSITORY,
        key: TodolistRepository.name,
      }),
    })
    private _todolistRepository: TodolistRepository,

    @inject({
      key: BindingKeys.build({
        namespace: BindingNamespaces.REPOSITORY,
        key: TodoItemRepository.name,
      }),
    })
    private _todoItemRepository: TodoItemRepository,
  ) {
    super({ scope: TodolistService.name });
  }

  async deleteTodolistById(opts: { id: number }): Promise<void> {
    const logger = this.logger.for(this.deleteTodolistById.name);
    const { id } = opts;

    const isExistedTodolist = await this._todolistRepository.existsWith({ where: { id } });
    if (!isExistedTodolist) {
      throw getError({
        message: 'Todolist not found',
        statusCode: HTTP.ResultCodes.RS_4.BadRequest,
      });
    }

    const transaction = await this._todolistRepository.beginTransaction();
    try {
      const { count: deletedTodoItemCount } = await this._todoItemRepository.deleteBy({
        where: {
          todolistId: id,
        },
        options: { transaction },
      });

      if (deletedTodoItemCount > 0) {
        logger.info(
          `Deleted ${deletedTodoItemCount} todo items associated with todolist id: ${id}`,
        );
      }

      await this._todolistRepository.deleteById({ id, options: { transaction } });
      logger.info(`Deleted todolist id: ${id}`);

      await transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  async deleteTodolistBy(opts: { where: TWhere<TTodolist> }) {
    const logger = this.logger.for(this.deleteTodolistBy.name);
    const { where } = opts;

    const todolistsWithId = await this._todolistRepository.find({
      filter: { where, fields: ['id'] },
    });
    const todolistIds = todolistsWithId.map((todolist) => todolist.id);

    if (todolistIds.length === 0) {
      logger.info('No todolists found matching the provided criteria. No deletion performed.');
      return;
    }

    const transaction = await this._todolistRepository.beginTransaction();
    try {
      const { count: deletedTodoItemCount } = await this._todoItemRepository.deleteBy({
        where: {
          todolistId: { inq: todolistIds },
        },
        options: { transaction },
      });

      if (deletedTodoItemCount > 0) {
        logger.info(
          `Deleted ${deletedTodoItemCount} todo items associated with todolist ids: ${todolistIds}`,
        );
      }

      const { count: deletedTodolistCount } = await this._todolistRepository.deleteBy({
        where: { id: todolistIds },
        options: { transaction },
      });
      logger.info(`Deleted ${deletedTodolistCount} todolists`);

      await transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }
}
