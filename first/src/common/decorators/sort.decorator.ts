import { OrderEnum } from '@/common/enums/order.enum';
import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ErrorMessages } from '../messages/error.messages';
import { SortOptionsType } from '../types/sort-options.type';

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const Sort = (
  defaultSortProperty: string = 'id',
  defaultOrder: 'asc' | 'desc' = 'asc',
): ParameterDecorator =>
  createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const sortProperty: string = query['sort'] || defaultSortProperty;
    let order = query['order'] || defaultOrder;

    switch (order) {
      case 'asc':
        order = OrderEnum.ASC;
        break;
      case 'desc':
        order = OrderEnum.DESC;
        break;
    }

    if (order !== OrderEnum.ASC && order !== OrderEnum.DESC) {
      throw new BadRequestException(ErrorMessages.Request.BadRequestException);
    }

    const sortOptions: SortOptionsType = {
      sortProperty,
      order,
    };

    return sortOptions;
  })();
