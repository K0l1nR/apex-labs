import {
  Entity,
  Property,
  types,
} from '@mikro-orm/core';
import { BaseFullEntity } from './abstract/base-full.entity';

@Entity({ tableName: 'books' })
export class Book extends BaseFullEntity<Book> {
  @Property({ type: types.text})
  name: string;

  @Property({ type: types.text })
  description: string;

  @Property({ type: types.text })
  author: string;
}
