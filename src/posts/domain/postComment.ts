import { PostCommentAuthor } from './postCommentAuthor';
import { IncorrectInputError } from '../../common/errors/errors';

export enum PostCommentStatus {
  ok = 'ok',
  deletedByUser = 'deletedByUser',
  unknown = 'unknown',
}

export interface PostComment {
  id: string;
  body: string;
  responses?: (PostComment | string)[];
  responsesCount: number;
  commentRef?: string;
  author: PostCommentAuthor | string;
  post?: string;
  upVotes: number;
  downVotes: number;
  status: PostCommentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export function newPostComment(payload: Partial<PostComment>): PostComment {
  if (!payload.id && typeof payload.id !== 'string') {
    throw new IncorrectInputError('Comment is missing id');
  }

  if (!payload.author) {
    throw new IncorrectInputError('Comment response is missing author');
  }

  if (!payload.body || payload.body === '') {
    throw new IncorrectInputError('Comment is empty');
  }

  if (!payload.post && !payload.commentRef) {
    throw new IncorrectInputError('Comment is missing post or postComment reference');
  }

  return {
    id: payload.id,
    body: payload.body,
    author: payload.author,
    post: payload.post,
    commentRef: payload.commentRef,
    status: PostCommentStatus.ok,
    responsesCount: 0,
    upVotes: 0,
    downVotes: 0,
    responses: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export type UpdatedPostComment = Pick<PostComment, 'id' | 'body' | 'updatedAt'>;

export function updatePostComment(payload: Partial<PostComment>): UpdatedPostComment {
  if (!payload.id && typeof payload.id !== 'string') {
    throw new IncorrectInputError('Comment is missing id');
  }

  if (!payload.body || payload.body === '') {
    throw new IncorrectInputError('Comment is empty');
  }

  return {
    id: payload.id,
    body: payload.body,
    updatedAt: new Date(),
  };
}
