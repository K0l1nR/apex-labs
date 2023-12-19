import { TokenService } from './token.service';
import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { RegistrationResultDto } from './dto/registration-result.dto';
import { AuthResultDto } from './dto/auth-result.dto';
import { DTOTransformInterceptor } from '@/common/interceptors/dto-transform.interceptor';
import { TrimTextPipe } from '@/common/pipes/trim-text.pipe';
import { ErrorMessages } from '@/common/messages/error.messages';
import { RegistrationResult } from './interfaces/registration-result.interface';
import { EmailLoginDto } from './dto/email-login.dto';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { Public } from '@/common/guards/public.guard';
import { MessagePattern } from '@nestjs/microservices';
import { logger } from '@mikro-orm/nestjs';

@ApiTags('auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly tokenService: TokenService,
    ) {}

    @Public()
    @MessagePattern({ cmd: 'validate_token' })
    async validateToken(data: { token: any }) {
      try {
        const token = data.token;
        const decoded = await this.tokenService.verifyToken(token);
        return { isValid: true, user: decoded };
      } catch (error) {
        return { isValid: false, user: null };
      }
    }
    

  @Public()
  @Post('registration')
  // @UseGuards(JwtRegistrationGuard)
  @ApiCreatedResponse({ type: RegistrationResultDto })
  @ApiBadRequestResponse()
  @ApiUnprocessableEntityResponse({
    description: ErrorMessages.User.AlreadyExist,
  })
  @UsePipes(new TrimTextPipe())
  registration(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationResult> {
    return this.authService.createAccount(createUserDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  @ApiNotFoundResponse({ description: ErrorMessages.User.NotFound })
  @ApiUnauthorizedResponse({ description: ErrorMessages.Token.Invalid })
  @ApiInternalServerErrorResponse()
  @ApiOkResponse()
  refresh(@Body() refreshDto: RefreshDto): Promise<AuthResponse> {
    return this.authService.refresh(refreshDto.refreshToken);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: AuthResultDto })
  @ApiNotFoundResponse({ description: ErrorMessages.User.NotFound })
  @UseInterceptors(new DTOTransformInterceptor(AuthResultDto))
  login(@Body() loginDto: EmailLoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: ErrorMessages.Token.NotFound })
  logout(@Body() logoutDto: LogoutDto): Promise<void> {
    return this.authService.logout(logoutDto.refreshToken);
  }
}
