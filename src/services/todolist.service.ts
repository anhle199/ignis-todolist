import type { TCreateTodolistRequest, TTodolist, TUpdateTodolistRequest } from '@/models';
import { TodoItemRepository, TodolistRepository } from '@/repositories';
import {
  BaseService,
  BindingKeys,
  BindingNamespaces,
  inject,
  type TFilter,
  type TWhere,
} from '@venizia/ignis';
import { getError, HTTP } from '@venizia/ignis-helpers';

export class TodolistService extends BaseService {
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
        namespace: BindingNamespaces.REPOSITORY,
        key: TodoItemRepository.name,
      }),
    })
    private _todoItemRepository: TodoItemRepository,
  ) {
    super({ scope: TodolistService.name });
  }

  async findTodolists(opts: { filter: TFilter<TTodolist>; withCounting?: boolean }) {
    const { filter, withCounting = false } = opts;

    const [todolists, count] = await Promise.all([
      this._repository.find({ filter }),
      withCounting ? this._repository.count({ where: filter.where ?? {} }) : Promise.resolve(0),
    ]);

    return { data: todolists, count };
  }

  async createTodolist(opts: { data: TCreateTodolistRequest }): Promise<TTodolist> {
    const { data } = opts;

    const isExistedTodolist = await this._repository.existsWith({ where: { code: data.code } });
    if (isExistedTodolist) {
      throw getError({
        message: 'Todolist with the same code already exists',
        statusCode: HTTP.ResultCodes.RS_4.BadRequest,
      });
    }

    const { data: createdTodolist } = await this._repository.create({ data });
    return createdTodolist;
  }

  async updateTodolistById(opts: { id: number; data: TUpdateTodolistRequest }): Promise<TTodolist> {
    const { id, data } = opts;

    const isExistedTodolist = await this._repository.existsWith({ where: { id } });
    if (!isExistedTodolist) {
      throw getError({
        message: 'Todolist not found',
        statusCode: HTTP.ResultCodes.RS_4.NotFound,
      });
    }

    const { data: updatedTodolist } = await this._repository.updateById({ id, data });
    return updatedTodolist;
  }

  async deleteTodolistById(opts: { id: number }): Promise<void> {
    const logger = this.logger.for(this.deleteTodolistById.name);
    const { id } = opts;

    const isExistedTodolist = await this._repository.existsWith({ where: { id } });
    if (!isExistedTodolist) {
      throw getError({
        message: 'Todolist not found',
        statusCode: HTTP.ResultCodes.RS_4.BadRequest,
      });
    }

    const transaction = await this._repository.beginTransaction();
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

      await this._repository.deleteById({ id, options: { transaction } });
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

    const todolistsWithId = await this._repository.find({
      filter: { where, fields: ['id'] },
    });
    const todolistIds = todolistsWithId.map((todolist) => todolist.id);

    if (todolistIds.length === 0) {
      logger.info('No todolists found matching the provided criteria. No deletion performed.');
      return;
    }

    const transaction = await this._repository.beginTransaction();
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

      const { count: deletedTodolistCount } = await this._repository.deleteBy({
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
