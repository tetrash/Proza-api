export enum ErrorType {
  IncorrectInput = 'INCORRECT_INPUT',
  Internal = 'INTERNAL',
  NotFound = 'NOT_FOUND',
  NotAuthenticated = 'NOT_AUTHENTICATED',
  NotAuthorized = 'NOT_AUTHORIZED',
}

export abstract class CustomError extends Error {
  constructor(public readonly errorDetails?: any, msg?: string) {
    super(msg || errorDetails.toString());
  }

  abstract readonly type: ErrorType;
}

export class IncorrectInputError extends CustomError {
  errorDetails = 'Incorrect input';
  type = ErrorType.IncorrectInput;
}

export class InternalError extends CustomError {
  errorDetails = 'Internal error';
  type = ErrorType.Internal;
}

export class NotFoundError extends CustomError {
  errorDetails = 'No results found';
  type = ErrorType.NotFound;
}

export class NotAuthenticatedError extends CustomError {
  errorDetails = 'User need to be authenticated to perform this action';
  type = ErrorType.NotAuthenticated;
}

export class NotAuthorizedError extends CustomError {
  errorDetails = 'User is not authorized to perform this action';
  type = ErrorType.NotAuthorized;
}
