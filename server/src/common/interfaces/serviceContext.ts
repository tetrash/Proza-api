import { User } from '../../users/domain/user';

export type UserContext = Pick<User, 'id' | 'openid' | 'role'>;

export interface ServiceContext {
  user?: UserContext;
}
