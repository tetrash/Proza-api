import { index, modelOptions, prop } from '@typegoose/typegoose';
import { DataMapper } from '../../common/interfaces/dataMapper';
import { User } from '../domain/user';

@index({ openid: 1, openidSource: 1 }, { unique: true })
@modelOptions({ schemaOptions: { collection: 'users' } })
export class UserEntity {
  constructor(payload: UserEntity) {
    Object.assign(this, payload);
  }

  @prop()
  _id: string;

  @prop({ required: true })
  username: string;

  @prop()
  fullName?: string;

  @prop()
  openid?: string;

  @prop()
  openidSource?: string;

  @prop()
  email?: string;

  @prop({ required: true })
  role: string;

  @prop()
  avatarUrl?: string;

  @prop()
  createdAt?: Date;

  @prop()
  updatedAt?: Date;
}

export class UserEntityMapper implements DataMapper<User, UserEntity> {
  toDomain(entity: UserEntity): User {
    return {
      id: entity._id,
      username: entity.username,
      fullName: entity.fullName,
      role: entity.role,
      email: entity.email,
      openid: entity.openid,
      openidSource: entity.openidSource,
      avatarUrl: entity.avatarUrl,
      updatedAt: (entity.updatedAt && new Date(entity.updatedAt)) || new Date(),
      createdAt: (entity.createdAt && new Date(entity.createdAt)) || new Date(),
    };
  }

  toEntity(domain: User): UserEntity {
    return new UserEntity({
      _id: domain.id,
      username: domain.username,
      fullName: domain.fullName,
      role: domain.role,
      email: domain.email,
      openid: domain.openid,
      openidSource: domain.openidSource,
      avatarUrl: domain.avatarUrl,
      updatedAt: domain.updatedAt,
      createdAt: domain.createdAt,
    });
  }
}
