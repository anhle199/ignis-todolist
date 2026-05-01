import { PostgresDataSource } from '@/datasources';
import { TodoItem, type TTodoItemSchema } from '@/models/schemas';
import { DefaultCRUDRepository, inject, repository } from '@venizia/ignis';

@repository({ dataSource: PostgresDataSource, model: TodoItem })
export class TodoItemRepository extends DefaultCRUDRepository<TTodoItemSchema> {
  constructor(
    @inject({ key: 'datasources.PostgresDataSource' })
    dataSource: PostgresDataSource,
  ) {
    super(dataSource);
  }
}
