import { DataMapper } from '../../common/interfaces/dataMapper';
import { Post } from '../domain/post';
import { DocumentType, modelOptions, prop } from '@typegoose/typegoose';
import { PaginatedModel } from '../../common/data/mongodb/paginateModel';

@modelOptions({ schemaOptions: { collection: 'posts' } })
export class PostEntity extends PaginatedModel {
  constructor(payload: PostEntity) {
    super();
    Object.assign(this, payload);
  }
  @prop()
  _id: string;

  @prop({ required: true })
  owner: string;

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
    return {
      id: entity._id,
      owner: entity.owner,
      title: entity.title,
      body: entity.body,
      updatedAt: (entity.updatedAt && new Date(entity.updatedAt)) || new Date(),
      createdAt: (entity.createdAt && new Date(entity.createdAt)) || new Date(),
    };
  }

  toEntity(domain: Post): PostEntity {
    return new PostEntity({
      _id: domain.id,
      owner: domain.owner,
      title: domain.title,
      body: domain.body,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
  }
}
