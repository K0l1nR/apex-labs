import { BaseEntity as Base, Entity, PrimaryKey, types } from '@mikro-orm/core';

interface BaseEntityProperties {
  id: number;
}

@Entity({ abstract: true })
export class BaseEntity<T> extends Base<T & BaseEntityProperties, 'id'> {
  @PrimaryKey({ type: types.integer })
  id!: number;
}
