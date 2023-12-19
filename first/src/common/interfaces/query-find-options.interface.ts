import { PaginateOptions } from '@/common/interfaces/paginate-options.interface';
import { SortOptionsType } from '@/common/types/sort-options.type';

export interface QueryFindOptions {
  pagination?: PaginateOptions;
  sort: SortOptionsType;
}
