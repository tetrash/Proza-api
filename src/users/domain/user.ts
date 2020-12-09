import { IncorrectInputError } from '../../common/errors/errors';

export interface User {
  id: string;
  username: string;
  fullName?: string;
  role: UserRole | string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  admin = 'admin',
  moderator = 'moderator',
  user = 'user',
}

export function newUser(payload: Partial<User>): User {
  if (!payload.id && typeof payload.id !== 'string') {
    throw new IncorrectInputError('User is missing id field');
  }

  if (!payload.username && typeof payload.username !== 'string') {
    throw new IncorrectInputError('User is missing username field');
  }

  return {
    id: payload.id,
    username: payload.username,
    fullName: payload.fullName,
    role: payload.role || UserRole.user,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export interface UserRepository {
  generateId(): string;
  getUser(userId: string): Promise<User>;
  createUser(payload: User): Promise<void>;
}
