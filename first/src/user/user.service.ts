import { EntityManager } from '@mikro-orm/postgresql';
import { ErrorMessages } from '@/common/messages/error.messages';
import { User } from '@/database/entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from '@/database/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly em: EntityManager,
  ) {}


  async getOneOrFail(id: string) {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException(ErrorMessages.User.NotFound);
    }

    return user;
  }

  async getOneById(id: string) {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException(ErrorMessages.User.NotFound);
    }

    return user;
  }

  getOneBy(
    key: keyof User,
    value: unknown,
    isProfileDeleted?: boolean,
  ): Promise<User> {
    if (!isProfileDeleted) {
      return this.userRepository.findOne({
        [key]: value,
      });
    }

    return this.userRepository.findOne({ [key]: value });
  }

  getOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }


  async create(createUserDto: CreateUserDto): Promise<User> {
    const isEmailBusy = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    if (isEmailBusy) {
      throw new ConflictException('This email is already in use');
    }

    const user = this.userRepository.create(createUserDto);

    this.userRepository.persist(user);

    return user;
  }

  async deleteProfile(id: string): Promise<User> {
    const user = await this.getOneOrFail(id);

    await this.em.persistAndFlush(user);

    return user;
  }

  async checkUserAccess(id: string): Promise<void> {
    const user = await this.getOneOrFail(id);

    if (!user.email) {
      throw new ForbiddenException(ErrorMessages.User.NotFound);
    }
  }

}
