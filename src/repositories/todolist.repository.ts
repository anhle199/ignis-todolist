import { PostgresDataSource } from '@/datasources';
import { Todolist, type TTodolistSchema } from '@/models/schemas';
import { DefaultCRUDRepository, inject, repository } from '@venizia/ignis';

@repository({ dataSource: PostgresDataSource, model: Todolist })
export class TodolistRepository extends DefaultCRUDRepository<TTodolistSchema> {
  constructor(
    @inject({ key: 'datasources.PostgresDataSource' })
    dataSource: PostgresDataSource,
  ) {
    super(dataSource);
  }
}
