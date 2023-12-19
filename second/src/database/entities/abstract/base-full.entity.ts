import {
  BaseEntity,
  Entity,
  PrimaryKey,
  Property,
  types,
} from '@mikro-orm/core';

interface BaseFullEntityProperties {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Entity({ abstract: true })
export class BaseFullEntity<T> extends BaseEntity<
  T & BaseFullEntityProperties,
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

  @Property({
    type: types.datetime,
    nullable: true,
    onUpdate: () => new Date(),
  })
  updatedAt: Date;
}
