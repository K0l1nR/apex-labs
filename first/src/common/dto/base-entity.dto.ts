import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseEntityDto {
  @ApiProperty()
  @Expose()
  id: number;
}
