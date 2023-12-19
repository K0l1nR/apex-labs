import { BaseFullEntityDto } from '@/common/dto/base-full-entity.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

@Exclude()
export class UserDto extends BaseFullEntityDto {
  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  password: string

  @ApiProperty({ type: Date })
  @Expose()
  lastLogin: Date;
}
