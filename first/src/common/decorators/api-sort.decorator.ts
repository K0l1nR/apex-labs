import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { QueryOrderEnum } from '../enums/query-order.enum';

export function ApiSorting() {
  return applyDecorators(
    ApiQuery({
      name: 'sort',
      type: 'string',
      description: 'Sort property',
      required: false,
    }),
    ApiQuery({
      name: 'order',
      enum: QueryOrderEnum,
      description: 'Sorting order',
      required: false,
    }),
  );
}
