import { DocumentType, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../../users/entities/user.entity';
import { Schema } from 'mongoose';
import { DataMapper } from '../../common/interfaces/dataMapper';
import { PostComment, PostCommentStatus } from '../domain/postComment';
import { PostEntity } from './post.entity';
import { PostCommentAuthor } from '../domain/postCommentAuthor';
import { PostCommentVoteEntity } from './postCommentVote.entity';
import { PaginatedModel } from '../../common/data/mongodb/paginateModel';

@modelOptions({ schemaOptions: { collection: 'postComments' } })
export class PostCommentEntity extends PaginatedModel {
  constructor(payload: PostCommentEntity) {
    super();
    Object.assign(this, payload);
  }

  @prop()
  _id: string;

  @prop({ required: true, ref: () => UserEntity, type: Schema.Types.String })
  author: Ref<UserEntity, string>;

  @prop({ required: true })
  body: string;

  @prop({ ref: () => PostCommentEntity, type: Schema.Types.String })
  responses: Ref<PostCommentEntity, string>[];

  @prop({ ref: () => PostCommentEntity, type: Schema.Types.String })
  commentRef?: Ref<PostCommentEntity, string>;

  @prop({ ref: () => PostEntity, type: Schema.Types.String })
  post?: Ref<PostEntity, string>;

  @prop({ ref: () => PostCommentVoteEntity })
  votes?: Ref<PostCommentVoteEntity>[];

  @prop()
  status: string;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;
}

export class PostCommentEntityMapper implements DataMapper<PostComment, PostCommentEntity> {
  toDomain(entity: DocumentType<PostCommentEntity> | PostCommentEntity): PostComment {
    const author =
      typeof entity.author === 'object'
        ? ({
            id: entity.author._id,
            username: entity.author.username,
          } as PostCommentAuthor)
        : entity.author;

    const post = typeof entity.post === 'object' ? entity.post._id : entity.post;
    const statusKey = entity.status as keyof typeof PostCommentStatus;

    const defaultVoteSum = { upVotes: 0, downVotes: 0, neutral: 0 };
    const votesSum = Array.isArray(entity.votes)
      ? entity.votes.reduce((sum, vote) => {
          const voteVal = sum;
          const value = (vote as Partial<PostCommentVoteEntity>).value || 0;

          if (value > 0) {
            voteVal.upVotes++;
          } else if (value < 0) {
            voteVal.downVotes++;
          } else {
            voteVal.neutral++;
          }
          return voteVal;
        }, defaultVoteSum)
      : defaultVoteSum;

    const responses = entity.responses.reduce((comments, obj) => {
      const result = comments;
      if (typeof obj === 'object') {
        result.push(this.toDomain(obj));
      }
      return result;
    }, [] as PostComment[]);

    return {
      id: entity._id,
      author: author || '',
      body: entity.body,
      post: post,
      upVotes: votesSum.upVotes,
      downVotes: votesSum.downVotes,
      status: PostCommentStatus[statusKey] || PostCommentStatus.unknown,
      responses,
      responsesCount: entity.responses.length,
      updatedAt: (entity.updatedAt && new Date(entity.updatedAt)) || new Date(),
      createdAt: (entity.createdAt && new Date(entity.createdAt)) || new Date(),
    };
  }

  toEntity(domain: PostComment): PostCommentEntity {
    const author = typeof domain.author === 'string' ? domain.author : domain.author.id;

    const responses: string[] = Array.isArray(domain.responses)
      ? domain.responses.map((res) => (typeof res === 'object' ? res.id : res))
      : [];

    return new PostCommentEntity({
      _id: domain.id,
      author: author,
      body: domain.body,
      post: domain.post,
      commentRef: domain.commentRef,
      responses,
      status: domain.status,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
  }
}
