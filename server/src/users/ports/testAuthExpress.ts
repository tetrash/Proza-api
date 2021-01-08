import { newUser, User, UserRole } from '../domain/user';
import { UsersMongodbAdapter } from '../adapters/usersMongodb.adapter';
import { UsersService } from '../users.service';
import { Router } from 'express';
import { NotAuthenticatedError } from '../../common/errors/errors';

const userRepo = new UsersMongodbAdapter();
const userService = new UsersService(userRepo);

export const createTestAuthRouter = async (): Promise<Router> => {
  const router = Router();

  const admin = newUser({ id: '00000000-0000-0000-0000-000000000000', username: 'admin', role: UserRole.admin });
  const mod = newUser({ id: '00000000-0000-0000-0000-000000000001', username: 'moderator', role: UserRole.moderator });
  const user = newUser({ id: '00000000-0000-0000-0000-000000000002', username: 'user', role: UserRole.user });

  const users: { [key: string]: User } = {
    admin: await userService.createOrReplaceUser(admin),
    moderator: await userService.createOrReplaceUser(mod),
    user: await userService.createOrReplaceUser(user),
  };

  router.get('/', (req, res, next) => {
    const { redirectTo, user } = req.query;
    if (typeof user === 'string' && !users[user]) {
      next(new NotAuthenticatedError("User doesn't exist"));
    }

    req.session.user = user && typeof user === 'string' ? users[user] : users.user;

    if (redirectTo) {
      return res.redirect(redirectTo.toString());
    }

    return res.send();
  });

  return router;
};
