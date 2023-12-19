import { User } from '@/database/entities/user.entity';
import { AuthResponse } from './auth-response.interface';

export type RegistrationResult = AuthResponse & { user: User };
