import { LoginTypeEnum } from './../enums/login-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ obj }) => obj.email.toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string

  type = LoginTypeEnum.EMAIL;
}
