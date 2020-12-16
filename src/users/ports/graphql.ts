import { IResolvers } from 'apollo-server-express';
import { ApolloContext } from '../../common/clients/graphql';
import { UsersMongodbAdapter } from '../adapters/usersMongodb.adapter';
import { UsersService } from '../users.service';

const userRepo = new UsersMongodbAdapter();
const userService = new UsersService(userRepo);

export const usersResolver: IResolvers<any, ApolloContext> = {
  Query: {
    me: async (parent, args, ctx) => {
      const user = await userService.getUser({ userId: ctx.user.id });
      ctx.session.user = user;
      return user;
    },
  },
};
