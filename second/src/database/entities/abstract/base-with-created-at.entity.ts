import {
  BaseEntity,
  Entity,
  PrimaryKey,
  Property,
  types,
} from '@mikro-orm/core';

interface BaseWithCreatedAtProperties {
  id: string;
  createdAt: Date;
}

@Entity({ abstract: true })
export class BaseWithCreatedAtEntity<T> extends BaseEntity<
  T & BaseWithCreatedAtProperties,
  'id'
> {
  @PrimaryKey({ type: types.uuid, defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property({
    type: types.datetime,
    nullable: true,
    onCreate: () => new Date(),
  })
  createdAt: Date;
}
