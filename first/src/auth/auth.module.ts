import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@/user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TokenService } from './token.service';
import { RefreshToken } from '@/database/entities/refresh-token.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { AppConfigModule } from '@/common/modules/config/app-config.module';
import { AppConfigService } from '@/common/modules/config/app-config.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([RefreshToken]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        secret: configService.secretKey,
        signOptions: {
          expiresIn: configService.secretKeyExpiresIn,
        },
      }),
    }),
    ThrottlerModule.forRoot(),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenService],
})
export class AuthModule implements OnModuleInit {
  constructor(
    private readonly orm: MikroORM,
  ) {}

  @UseRequestContext()
  onModuleInit() {
  
  }
}
