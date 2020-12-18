import { NotAuthenticatedError, NotAuthorizedError } from '../errors/errors';
import { ServiceContext } from '../interfaces/serviceContext';
import { UserRole } from '../../users/domain/user';

export function HasRole(role: string | string[] | UserRole | UserRole[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (data: any, ctx: ServiceContext) {
      if (!ctx.user || !ctx.user.role) {
        throw new NotAuthenticatedError();
      }

      const roles = Array.isArray(role) ? role : [role];

      if (!roles.includes(ctx.user.role)) {
        throw new NotAuthorizedError();
      }

      return originalMethod.apply(this, [data, ctx]);
    };
  };
}
