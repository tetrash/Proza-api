import { User } from '../../users/domain/user';

export interface ServiceContext {
  user?: User;
}
