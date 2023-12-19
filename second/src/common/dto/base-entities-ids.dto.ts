import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class BaseEntitiesIdsDto {
  @ApiProperty()
  @ArrayNotEmpty({ message: 'Обязательное поле' })
  @IsArray({ message: 'Значение должно быть массивом' })
  @IsUUID('all', { each: true })
  ids: string[];
}
