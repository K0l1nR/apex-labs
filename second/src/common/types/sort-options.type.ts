import { OrderEnum } from '@/common/enums/order.enum';

export type SortOptionsType = {
  sortProperty: string;
  order: OrderEnum;
};

export type SortByType =
  | Record<string, OrderEnum>
  | Record<string, OrderEnum>[];
