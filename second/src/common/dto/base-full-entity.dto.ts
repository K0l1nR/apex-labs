import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseFullEntityDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: Date })
  @Expose()
  createdAt: string;

  @ApiProperty({ type: Date })
  @Expose()
  updatedAt: string;
}
