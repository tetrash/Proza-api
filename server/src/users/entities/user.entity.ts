import { modelOptions, prop } from '@typegoose/typegoose';
import { DataMapper } from '../../common/interfaces/dataMapper';
import { User } from '../domain/user';

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

  @prop({ unique: true })
  openid?: string;

  @prop()
  email?: string;

  @prop({ required: true })
  role: string;

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
      updatedAt: domain.updatedAt,
      createdAt: domain.createdAt,
    });
  }
}
