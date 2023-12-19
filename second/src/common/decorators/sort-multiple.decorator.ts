import { OrderEnum } from '@/common/enums/order.enum';
import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ErrorMessages } from '../messages/error.messages';
import { SortOptionsType } from '../types/sort-options.type';

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const SortMultiple = (
  defaultSortProperty = 'id',
  defaultOrder: 'asc' | 'desc' = 'asc',
): ParameterDecorator =>
  createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const sortProperty: string = query['sort']?.split(',') || [
      defaultSortProperty,
    ];
    const queryOrder = query['order']?.split(',') || [defaultOrder];

    const order = queryOrder.map((el) => {
      switch (el) {
        case 'asc':
          return OrderEnum.ASC;
        case 'desc':
          return OrderEnum.DESC;
        default:
          throw new BadRequestException(
            ErrorMessages.Request.BadRequestException,
          );
      }
    });

    const sortOptions: SortOptionsType = {
      sortProperty,
      order,
    };

    return sortOptions;
  })();
