import { ApiAuth } from '@/common/decorators/api-auth.decorator';
import { User } from '@/database/entities/user.entity';
import {
  Controller,
  Delete,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from './user.service';

@ApiAuth()
@ApiTags('Users')
@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete('profile')
  deleteProfile(@Req() req: Request): Promise<User> {
    return this.userService.deleteProfile(req.user.userId);
  }
}
