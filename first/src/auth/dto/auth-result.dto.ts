import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthResultDto {
  @ApiProperty()
  @Expose()
  accessToken: string;

  @ApiProperty()
  @Expose()
  accessTokenTtl: number;

  @ApiProperty()
  @Expose()
  refreshToken: string;

  @ApiProperty({ description: 'in seconds' })
  @Expose()
  refreshTokenTtl: number;
}
