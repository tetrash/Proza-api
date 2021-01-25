import { IResolvers } from 'apollo-server-express';
import { PostsMongodbAdapter } from '../adapters/postsMongodb.adapter';
import { PostsService } from '../posts.service';
import { ApolloContext } from '../../common/clients/graphql';
import { PostCommentsService } from '../postComments.service';

const postMongodbRepo = new PostsMongodbAdapter();
const postService = new PostsService(postMongodbRepo);
const postCommentService = new PostCommentsService(postMongodbRepo);

export const postsResolver: IResolvers<any, ApolloContext> = {
  Query: {
    listPosts: (source, args) => {
      return postService.listPosts(args.paginate);
    },
    getPost: (source, args) => {
      return postService.getPost({ postId: args.postId });
    },
  },
  Mutation: {
    createPost: (source, args, context) => {
      return postService.createPost(args.post, { user: context.user });
    },
    deletePost: (source, args, context) => {
      return postService.deletePost({ postId: args.postId }, { user: context.user });
    },
    updatePost: (source, args, context) => {
      return postService.updatePost(args.post, { user: context.user });
    },
  },
};

export const postCommentResolver: IResolvers<any, ApolloContext> = {
  Mutation: {
    addPostComment: (source, args, context) => {
      return postCommentService.commentPost(args.comment, context);
    },
    respondToPostComment: (source, args, context) => {
      return postCommentService.respondToPostComment(args.comment, context);
    },
    voteForPostComment: (source, args, context) => {
      return postCommentService.voteForPostComment(args.vote, context);
    },
  },
  Query: {
    listPostComments: (source, args) => {
      const query = { post: args.postId };
      return postCommentService.listPostComments({ query, ...args.pagination });
    },
    getCommentResponses: (source, args) => {
      return postCommentService.getCommentResponses({ postCommentId: args.postId, ...args.pagination });
    },
  },
};
