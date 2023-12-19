import { ErrorMessages } from '@/common/messages/error.messages';
import { RefreshToken } from '@/database/entities/refresh-token.entity';
import { User } from '@/database/entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { AuthJwt } from './interfaces/auth-jwt.interface';
import { AppConfigService } from '@/common/modules/config/app-config.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: EntityRepository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async verifyToken(token: string): Promise<AuthJwt> {
    try {
      const options: JwtVerifyOptions = {
        secret: this.appConfigService.secretKey,
      };
      return await this.jwtService.verifyAsync<AuthJwt>(token, options);
    } catch (error) {
      console.error(`Token verification failed. Token: ${token}`, error);
      throw new UnauthorizedException(ErrorMessages.Token.Invalid);
    }
  }
  
  getOneRefreshToken(token: string) {
    return this.refreshTokenRepository.find({ token });
  }

  generateAccessToken(user: User): string {
    return this.jwtService.sign({ userId: user.id });
  }

  get accessTokenTtl() {
    return this.appConfigService.secretKeyExpiresIn;
  }

  generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      { userId: user.id },
      this.getRefreshTokenOptions(),
    );
  }

  generateBothTokens(user: User) {
    const accessToken: string = this.generateAccessToken(user);
    const accessTokenTtl: number = this.accessTokenTtl;
    const refreshToken: string = this.generateRefreshToken(user);
    const refreshTokenTtl: number = this.appConfigService.refreshExpiresIn;

    return {
      accessToken,
      accessTokenTtl,
      refreshToken,
      refreshTokenTtl,
    };
  }

  decodeToken(token: string): AuthJwt {
    return this.jwtService.decode(token) as AuthJwt;
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync(token, this.getRefreshTokenOptions());
  }

  createRefreshToken(token: string, user: User): RefreshToken {
    const refreshToken = new RefreshToken();

    refreshToken.user = user;
    refreshToken.token = token;
    refreshToken.expiration = this.appConfigService.refreshExpiresIn;

    this.refreshTokenRepository.persist(refreshToken);

    return refreshToken;
  }

  async removeRefreshToken(token: string, flush = false): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.findOne({ token });
    if (!refreshToken) {
      throw new NotFoundException(ErrorMessages.Token.NotFound);
    }

    this.refreshTokenRepository.remove(refreshToken);

    if (flush) {
      return this.refreshTokenRepository.flush();
    }
  }

  private getRefreshTokenOptions(): JwtSignOptions {
    const options: JwtSignOptions = {
      secret: this.appConfigService.refreshSecretKey,
      expiresIn: this.appConfigService.refreshExpiresIn,
    };
    return options;
  }
}
