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

  abstract readonly type: ErrorType;
}

export class IncorrectInputError extends CustomError {
  message = 'Incorrect input';
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
  message = 'No results found';
  type = ErrorType.NotFound;
}

export class NotAuthenticatedError extends CustomError {
  message = 'User need to be authenticated to perform this action';
  type = ErrorType.NotAuthenticated;
}

export class NotAuthorizedError extends CustomError {
  message = 'User is not authorized to perform this action';
  type = ErrorType.NotAuthorized;
}
