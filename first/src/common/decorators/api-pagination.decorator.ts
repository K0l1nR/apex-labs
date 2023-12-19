import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiPagination() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      type: 'number',
      description: 'Page Number',
      required: false,
    }),
    ApiQuery({
      name: 'size',
      type: 'number',
      description: 'Page Size',
      required: false,
    }),
  );
}
