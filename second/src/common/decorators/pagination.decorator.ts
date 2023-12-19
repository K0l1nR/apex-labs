import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { PaginateOptions } from '../interfaces/paginate-options.interface';
import { ErrorMessages } from '../messages/error.messages';

export const Pagination = (
  defaultPage = 1,
  defaultSize = 24,
): ParameterDecorator =>
  createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const page: number = query?.page ? Number(query.page) : defaultPage;
    const size: number = query?.size ? Number(query.size) : defaultSize;

    if (page <= 0 || size <= 0) {
      throw new BadRequestException(ErrorMessages.Request.BadRequestException);
    }

    const limit: number = size;
    const offset: number = (page - 1) * size;

    const paginateOptions: PaginateOptions = {
      limit,
      offset,
    };

    return paginateOptions;
  })();
