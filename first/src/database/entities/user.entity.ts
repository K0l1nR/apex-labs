import {
  Entity,
  Property,
  types,
} from '@mikro-orm/core';
import { BaseFullEntity } from './abstract/base-full.entity';

@Entity({ tableName: 'users' })
export class User extends BaseFullEntity<User> {
  @Property({ type: types.text, unique: true, nullable: true })
  email?: string | null;

  @Property({ type: types.text, nullable: true })
  firstName?: string;

  @Property({ type: types.text, nullable: true })
  lastName?: string;

  @Property({ type: types.datetime, nullable: true })
  lastLogin: Date;

  @Property()
  password: string
}
