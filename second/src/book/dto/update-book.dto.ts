import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class UpdateBookDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  author?: string;
}
