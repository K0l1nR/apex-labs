import { User } from '../entities/user.entity';
import { BaseRepository } from './abstract/base.repository';

export class UserRepository extends BaseRepository<User> {
  searchColumns = ['email', 'firstName', 'lastName'];
}
