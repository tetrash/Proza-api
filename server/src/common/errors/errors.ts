import { ValidationError } from 'class-validator';

export enum ErrorType {
  IncorrectInput = 'INCORRECT_INPUT',
  Internal = 'INTERNAL',
  NotFound = 'NOT_FOUND',
  NotAuthenticated = 'NOT_AUTHENTICATED',
  NotAuthorized = 'NOT_AUTHORIZED',
}

export abstract class CustomError extends Error {
  constructor(msg?: any) {
    super((msg && msg.toString()) || undefined);
  }

  public message: string;
  abstract readonly type: ErrorType;
}

export class IncorrectInputError extends CustomError {
  constructor(input: string | ValidationError[] = 'Incorrect input') {
    super(input);

    if (Array.isArray(input) && input.length) {
      this.message = `Incorrect input\n${IncorrectInputError.extractErrorMessages(input).join('\n')}`;
    } else if (typeof input === 'string') {
      this.message = input;
    }
  }

  static extractErrorMessages(errors: ValidationError[]): string[] {
    return errors.reduce((arr, err) => {
      const result = arr;
      if (err.constraints) {
        result.push(...Object.values(err.constraints));
      }
      if (err.children) {
        result.push(...IncorrectInputError.extractErrorMessages(err.children));
      }

      return result;
    }, [] as string[]);
  }

  type = ErrorType.IncorrectInput;
}

export class InternalError extends CustomError {
  constructor(public readonly details?: any) {
    super();
  }

  message = 'Internal error';
  type = ErrorType.Internal;
}

export class NotFoundError extends CustomError {
  constructor(public readonly message = 'No results found') {
    super(message);
  }
  type = ErrorType.NotFound;
}

export class NotAuthenticatedError extends CustomError {
  constructor(public readonly message = 'User need to be authenticated to perform this action') {
    super(message);
  }
  type = ErrorType.NotAuthenticated;
}

export class NotAuthorizedError extends CustomError {
  constructor(public readonly message = 'User is not authorized to perform this action') {
    super(message);
  }
  type = ErrorType.NotAuthorized;
}
