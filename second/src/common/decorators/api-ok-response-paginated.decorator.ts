import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';
import { PagePaginationDto } from '../dto/page-pagintion.dto';

export const ApiOkResponsePaginated = <T>(DataType: ClassConstructor<T>) =>
  applyDecorators(
    ApiExtraModels(PagePaginationDto, DataType),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PagePaginationDto) },
          {
            properties: {
              result: {
                type: 'array',
                items: { $ref: getSchemaPath(DataType) },
              },
            },
          },
        ],
      },
    }),
  );
