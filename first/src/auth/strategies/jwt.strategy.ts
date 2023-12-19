import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthJwt } from '../interfaces/auth-jwt.interface';
import { AppConfigService } from '@/common/modules/config/app-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private appConfigService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.secretKey,
    });
  }

  async validate(payload: AuthJwt) {
    return {
      userId: payload.userId,
    };
  }
}
