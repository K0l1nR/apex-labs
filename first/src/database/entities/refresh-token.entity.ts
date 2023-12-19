import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { BaseWithCreatedAtEntity } from './abstract/base-with-created-at.entity';
import { User } from './user.entity';
import { dayjs } from '@/utils/dayjs';

@Entity({ tableName: 'refresh_tokens' })
export class RefreshToken extends BaseWithCreatedAtEntity<RefreshToken> {
  @ManyToOne(() => User, { onDelete: 'cascade' })
  user: User;

  @Property({ type: types.text })
  token: string;
  
  @Property({ type: types.datetime, nullable: true })
  expiresAt: Date;

  set expiration(s: number) {
    this.expiresAt = dayjs().utc().add(s, 'seconds').toDate();
  }

}
