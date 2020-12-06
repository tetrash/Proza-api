import { IResolvers } from 'apollo-server-express';
import { MongodbAdapter } from '../adapters/mongodb.adapter';
import { PostsService } from '../posts.service';
import { ApolloContext } from '../../common/clients/graphql';

const postMongodbRepo = new MongodbAdapter();
const postService = new PostsService(postMongodbRepo);

export const postsResolver: IResolvers<any, ApolloContext> = {
  Query: {
    listPosts: (parent, args) => {
      return postService.listPosts(args.paginate);
    },
    getPost: (parent, args) => {
      return postService.getPost({ postId: args.postId });
    },
  },
  Mutation: {
    createPost: (parent, args, ctx) => {
      return postService.createPost({ ...args.post, owner: ctx.userId });
    },
  },
};
