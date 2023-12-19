import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class PagePaginationDto<T> {
  @ApiProperty({ isArray: true })
  @IsArray()
  readonly result: T[];

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 0 })
  readonly currentPage: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 0 })
  readonly pageSize: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 0 })
  readonly itemsCount: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 0 })
  readonly pagesCount: number;

  @ApiProperty()
  @IsString()
  readonly hasPrevPage: boolean;

  @ApiProperty()
  @IsString()
  readonly hasNextPage: boolean;
}
