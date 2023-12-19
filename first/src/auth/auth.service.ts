import { User } from '@/database/entities/user.entity';
import { UserService } from '@/user/user.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthJwt } from './interfaces/auth-jwt.interface';
import { AuthResponse } from './interfaces/auth-response.interface';
import { TokenService } from './token.service';
import { ErrorMessages } from '@/common/messages/error.messages';
import { EntityManager } from '@mikro-orm/postgresql';
import { RegistrationResult } from './interfaces/registration-result.interface';
import { EmailLoginDto } from './dto/email-login.dto';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly em: EntityManager,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  private comparePasswords(password: string, storedPasswordHash: string): Promise<boolean> {
    return bcrypt.compare(password, storedPasswordHash);
  }

  async createAccount(createUserDto: CreateUserDto): Promise<RegistrationResult> {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = await this.userService.create({...createUserDto, password: hashedPassword});
    user.lastLogin = new Date();

    await this.em.flush();

    const tokens = this.tokenService.generateBothTokens(user);
    this.tokenService.createRefreshToken(tokens.refreshToken, user);

    await this.em.flush();

    const result: RegistrationResult = {
      ...tokens,
      user,
    };

    return result;
  }


  async login(loginDto: EmailLoginDto): Promise<AuthResponse> {
    const user: User = await this.userService.getOneBy(
      'email',
      loginDto.email,
    );

    if (!user) {
      throw new NotFoundException(ErrorMessages.User.NotFound);
    }

    const passwordsAreEqual = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordsAreEqual) {
      throw new NotFoundException(ErrorMessages.User.WrongPassword);
    }

    const tokens = this.tokenService.generateBothTokens(user);
    this.tokenService.createRefreshToken(tokens.refreshToken, user);

    user.lastLogin = new Date(); 

    await this.em.flush();

    const result: AuthResponse = {
      ...tokens,
    };

    return result;
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const jwtDecoded: AuthJwt = this.tokenService.decodeToken(refreshToken);
    if (!jwtDecoded) {
      throw new Error(ErrorMessages.Token.DecodeError);
    }

    const user = await this.userService.getOneOrFail(jwtDecoded.userId);

    try {
      await this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException(ErrorMessages.Token.Invalid);
    }

    const tokens: AuthResponse = this.tokenService.generateBothTokens(user);

    await this.tokenService.removeRefreshToken(refreshToken);
    this.tokenService.createRefreshToken(tokens.refreshToken, user);

    await this.em.flush();

    return tokens;
  }

  logout(refreshToken: string): Promise<void> {
    return this.tokenService.removeRefreshToken(refreshToken, true);
  }
}
