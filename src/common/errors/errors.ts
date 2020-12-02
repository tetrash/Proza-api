export enum ErrorType {
  IncorrectInput = 'INCORRECT_INPUT',
  Internal = 'INTERNAL',
  NotFound = 'NOT_FOUND',
}

export abstract class CustomError extends Error {
  constructor(public readonly errorDetails: any, msg?: string) {
    super(msg || errorDetails.toString());
  }

  abstract readonly type: ErrorType;
}

export class IncorrectInputError extends CustomError {
  type = ErrorType.IncorrectInput;
}

export class InternalError extends CustomError {
  type = ErrorType.Internal;
}

export class NotFoundError extends CustomError {
  type = ErrorType.NotFound;
}
