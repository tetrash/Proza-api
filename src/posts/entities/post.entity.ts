import { DataMapper } from '../../common/interfaces/dataMapper';
import { Post } from '../domain/post';
import { DocumentType, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { PaginatedModel } from '../../common/data/mongodb/paginateModel';
import { UserEntity } from '../../users/entities/user.entity';
import { PostAuthor } from '../domain/postAuthor';
import { Schema } from 'mongoose';

@modelOptions({ schemaOptions: { collection: 'posts' } })
export class PostEntity extends PaginatedModel {
  constructor(payload: PostEntity) {
    super();
    Object.assign(this, payload);
  }
  @prop()
  _id: string;

  @prop({ required: true, ref: () => UserEntity, refType: Schema.Types.String })
  author: Ref<UserEntity, string>;

  @prop({ required: true })
  title: string;

  @prop({ required: true })
  body: string;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;
}

export class PostEntityMapper implements DataMapper<Post, PostEntity> {
  toDomain(entity: DocumentType<PostEntity> | PostEntity): Post {
    const author =
      typeof entity.author === 'object'
        ? ({
            id: entity.author._id,
            username: entity.author.username,
            fullname: entity.author.fullName,
          } as PostAuthor)
        : entity.author;

    return {
      id: entity._id,
      author: author || '',
      title: entity.title,
      body: entity.body,
      updatedAt: (entity.updatedAt && new Date(entity.updatedAt)) || new Date(),
      createdAt: (entity.createdAt && new Date(entity.createdAt)) || new Date(),
    };
  }

  toEntity(domain: Post): PostEntity {
    const author = typeof domain.author === 'string' ? domain.author : domain.author.id;

    return new PostEntity({
      _id: domain.id,
      author: author,
      title: domain.title,
      body: domain.body,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
  }
}
