import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ nullable: true })
  @IsString()
  name: string;

  @ApiProperty({ nullable: true })
  @IsString()
  description: string;

  @ApiProperty({ nullable: true })
  @IsString()
  author: string;
}
