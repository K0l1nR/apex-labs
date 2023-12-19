import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';

type ApiSearchOptions = ApiQueryOptions;

export function ApiSearch(options?: ApiSearchOptions) {
  return applyDecorators(
    ApiQuery({
      name: 'q',
      type: 'string',
      description: 'Search',
      required: false,
      ...options,
    }),
  );
}
