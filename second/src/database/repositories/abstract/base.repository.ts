import { OrderEnum } from '@/common/enums/order.enum';
import { PaginateOptions } from '@/common/interfaces/paginate-options.interface';
import { QueryFilter } from '@/common/interfaces/query-filter.interface';
import { QueryFindOptions } from '@/common/interfaces/query-find-options.interface';
import { ErrorMessages } from '@/common/messages/error.messages';
import { SortByType, SortOptionsType } from '@/common/types/sort-options.type';
import {
  FindOptions,
  NotFoundError,
  QueryOrder,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { FilterQuery, RequiredEntityData } from '@mikro-orm/core/typings';
import { EntityRepository } from '@mikro-orm/postgresql';
import { dayjs } from '@/utils/dayjs';
import { move } from '@/utils/array';
import { BaseFullEntity } from '@/database/entities/abstract/base-full.entity';

export abstract class BaseRepository<
  T extends BaseFullEntity<T>,
> extends EntityRepository<T> {
  public searchColumns: string[] = [];
  public excludeSortFields: string[] = [];

  public getSearchFilter(
    query: string,
    columns: string[] = this.searchColumns,
  ): FilterQuery<T> {
    if (!query) {
      return;
    }

    const fields = columns.map((column) => {
      return { [column]: { $ilike: '%' + query + '%' } };
    });

    const filter = { $or: fields } as FilterQuery<T>;

    return filter;
  }

  public getOrderBy(options: SortOptionsType): Record<string, OrderEnum> {
    if (!options) {
      return;
    }

    const { sortProperty, order } = options;

    if (!sortProperty || !order) {
      return;
    }

    return { [sortProperty]: order };
  }

  public getPagination(
    pagingArgs: PaginateOptions,
  ): Pick<FindOptions<T>, 'limit' | 'offset'> {
    return pagingArgs;
  }

  public getPropertiesFilter(
    data: Partial<Record<keyof T, unknown>>,
  ): FilterQuery<T> {
    return Object.entries(data).reduce((prev, [key, value]) => {
      if (typeof value === 'undefined') {
        return prev;
      }

      prev[key] = value;

      const isValidDate: boolean = dayjs(String(value)).isValid();

      if (isValidDate) {
        prev[key] = {
          $gte: dayjs(String(value)).toDate(),
          $lt: dayjs(String(value)).add(1, 'day').toDate(),
        };
      }

      return prev;
    }, {} as FilterQuery<T>);
  }

  public getFilterQuery(data: QueryFilter<T>): FilterQuery<T> {
    const searchFilter = this.getSearchFilter(data.query);
    const propertiesFilter = this.getPropertiesFilter(data.filter);

    return Object.assign({}, searchFilter, propertiesFilter);
  }

  public getFindOptions<P extends string>(
    options: QueryFindOptions,
    other: FindOptions<T, P> = {},
  ): FindOptions<T, P> {
    const sortOptions: SortOptionsType = { ...options.sort };

    const pagination = this.getPagination(options.pagination);

    if (this.excludeSortFields.includes(sortOptions.sortProperty)) {
      sortOptions.sortProperty = 'id';
    }

    let orderBy: SortByType = this.getOrderBy(sortOptions);

    if (Array.isArray(sortOptions.sortProperty)) {
      orderBy = sortOptions.sortProperty.map((el, index) => {
        const order = sortOptions.order[index] as OrderEnum;
        if (this.excludeSortFields.includes(el)) {
          return this.getOrderBy({ sortProperty: 'id', order });
        }
        return this.getOrderBy({ sortProperty: el, order });
      });
    }

    return Object.assign(other, pagination, { orderBy });
  }

  public async getEntitiesListByFilters(
    options: Record<string, unknown>,
  ): Promise<T[]> {
    const entityName = this.entityName.toString();
    const list = await this._em
      .find(entityName, options)
      .then((res) => {
        if (!res) {
          throw new NotFoundError(ErrorMessages.Common.NotFoundElements);
        }
        return res;
      })
      .catch(() => {
        throw new NotFoundError(ErrorMessages.Common.NotFoundElements);
      });

    return list as T[];
  }

  public async removeEntitiesList(idsList: string[]): Promise<boolean> {
    const entityName = this.entityName.toString();
    const options = { id: idsList };
    const entitiesList = await this.getEntitiesListByFilters(options);

    if (entitiesList.length === 0) {
      return;
    }

    await this._em.nativeDelete(entityName, entitiesList);
    return true;
  }

  public async archiveEntitiesList(idsList: string[]): Promise<boolean> {
    const entityName = this.entityName.toString();
    const options = {
      id: idsList,
      isArchive: { $in: [true, false] },
    };

    const list = await this.getEntitiesListByFilters(options);

    if (list.length === 0) {
      return;
    }

    await this._em.nativeUpdate(
      entityName,
      { id: idsList, isArchive: false },
      { isArchive: true },
    );

    return true;
  }

  public async restoreEntitiesList(idsList: string[]): Promise<boolean> {
    const entityName = this.entityName.toString();
    const options = {
      id: idsList,
      isArchive: { $in: [true, false] },
    };
    const list = await this.getEntitiesListByFilters(options);

    if (list.length === 0) {
      return;
    }

    await this._em.nativeUpdate(
      entityName,
      { id: idsList, isArchive: true },
      { isArchive: false },
    );

    return true;
  }

  public async checkUniqueConstraint(
    key: keyof T,
    value: unknown,
  ): Promise<boolean> {
    const isExist = await this.findOne({ [key]: value } as FilterQuery<T>);

    if (isExist) {
      throw new UniqueConstraintViolationException(
        new Error(`${key.toString()} with value ${value} already exist`),
      );
    }

    return true;
  }

  public async shift<D extends T & { order: number }>(
    id: string | number,
    order: number,
    where?: FilterQuery<D>,
  ): Promise<boolean> {
    const entityName = this.entityName.toString();

    const options = { orderBy: { order: QueryOrder.ASC } } as FindOptions<D>;

    let entities: D[] = await this.em.find<D>(entityName, where, options);

    const indexA: number = entities.findIndex((d) => d.id === id);
    const indexB: number = order - 1;

    entities = move(entities, indexA, indexB - indexA);

    entities.forEach((d, i) => {
      d.order = i + 1;
    });

    await this.em.flush();

    return true;
  }

  public async autoReorder<D extends T & { order: number }>(
    where?: FilterQuery<D>,
  ): Promise<boolean> {
    const entityName = this.entityName.toString();

    const options = { orderBy: { order: QueryOrder.ASC } } as FindOptions<D>;

    const entities: D[] = await this.em.find<D>(entityName, where, options);

    entities.forEach((d, i) => {
      d.order = i + 1;
    });

    await this.em.flush();

    return true;
  }

  async updateOrCreate(
    where: FilterQuery<T>,
    data: RequiredEntityData<T>,
  ): Promise<T> {
    let entity: T = await this.findOne(where);

    if (entity) {
      entity.assign(data as any);
    } else {
      entity = this.create<T>(data);
    }

    await this.persistAndFlush(entity);

    return entity;
  }
}
