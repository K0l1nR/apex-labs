import { UserDto } from '@/user/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { AuthResultDto } from './auth-result.dto';

@Exclude()
export class RegistrationResultDto extends AuthResultDto {
  @ApiProperty()
  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
