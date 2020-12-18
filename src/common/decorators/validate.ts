import { validate } from 'class-validator';
import { IncorrectInputError } from '../errors/errors';
import { ServiceContext } from '../interfaces/serviceContext';

export function Validate(dto: any) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (data: any, ctx: ServiceContext) {
      const validatedData = new dto(data);
      const errors = await validate(validatedData);
      if (errors.length) {
        throw new IncorrectInputError(errors);
      }
      return originalMethod.apply(this, [validatedData, ctx]);
    };
  };
}
