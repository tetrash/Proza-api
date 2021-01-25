import { index, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../../users/entities/user.entity';
import { Schema } from 'mongoose';
import { PostCommentEntity } from './postComment.entity';

@index({ author: 1, comment: 1 }, { unique: true })
@modelOptions({ schemaOptions: { collection: 'postCommentVotes' } })
export class PostCommentVoteEntity {
  constructor(payload: PostCommentVoteEntity) {
    Object.assign(this, payload);
  }

  @prop({ required: true, ref: () => UserEntity, type: Schema.Types.String })
  author: Ref<UserEntity, string>;

  @prop({ required: true, ref: () => PostCommentEntity, type: Schema.Types.String })
  comment: Ref<PostCommentEntity, string>;

  @prop()
  value: number;
}
