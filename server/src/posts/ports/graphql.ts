import { IResolvers } from 'apollo-server-express';
import { PostsMongodbAdapter } from '../adapters/postsMongodb.adapter';
import { PostsService } from '../posts.service';
import { ApolloContext } from '../../common/clients/graphql';

const postMongodbRepo = new PostsMongodbAdapter();
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
      return postService.createPost(args.post, { user: ctx.user });
    },
    deletePost: (source, args, context) => {
      return postService.deletePost({ postId: args.postId }, { user: context.user });
    },
  },
};
