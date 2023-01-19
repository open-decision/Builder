import { ZodError, ZodIssue } from "zod";
import { ErrorCodes, TProgrammerErrors } from "./ErrorCodes";

export type ODErrorConstructorParameters<
  TErrorCodes extends ErrorCodes = ErrorCodes
> = {
  code: TErrorCodes;
  additionalData?: Record<string, unknown>;
  message?: string;
  isOperational?: boolean;
} & Omit<Error, "name" | "message">;

export class ODError<
  TErrorCodes extends ErrorCodes = ErrorCodes
> extends Error {
  readonly code: TErrorCodes;
  readonly timestamp?: number;
  readonly additionalData?: Record<string, unknown>;
  /**
   * An operational error is an expected error resulting from invalid inputs or user behaviors.
   * This should be true for all cases where the user is directly responsible for the error and should
   * be informed. This should not break the application flow and should be easily recoverable.
   *
   * A non operational error on the other hand describes an unexpected error that should be fixed by
   * the programmer.
   */
  readonly isOperational: boolean;

  constructor({
    code,
    additionalData,
    message,
    isOperational = true,
  }: ODErrorConstructorParameters<TErrorCodes>) {
    super(message);

    this.code = code;
    this.timestamp = Date.now();
    this.name = "ODError";
    this.additionalData = additionalData;
    this.isOperational = isOperational;
  }
}

export type ODProgrammerErrorConstructorParameters<
  TCode extends TProgrammerErrors
> = {
  link?: string;
  code: TCode;
  message?: string;
};

export class ODProgrammerError<
  TCode extends TProgrammerErrors = TProgrammerErrors
> extends Error {
  link?: string;
  code?: TCode;

  constructor({
    link,
    code,
    message,
  }: ODProgrammerErrorConstructorParameters<TCode>) {
    super(message);
    this.code = code;
    this.link = link;
  }
}

export type ODValidationErrorConstructorParameters<
  TErrorCodes extends ErrorCodes = ErrorCodes
> = ODErrorConstructorParameters<TErrorCodes> & {
  zodError: ZodError;
};

export class ODValidationError<
  TErrorCodes extends ErrorCodes = ErrorCodes
> extends ODError<TErrorCodes> {
  issues?: ZodIssue[];

  constructor({
    zodError,
    ...args
  }: ODValidationErrorConstructorParameters<TErrorCodes>) {
    super(args);

    this.issues = zodError?.issues;
  }
}
export const isODError = (error: any): error is ODError => !!error?.code;

export const convertToODError = (error: any) =>
  isODError(error)
    ? error
    : new ODError({ ...error, code: "UNEXPECTED_ERROR" });

export { ZodError } from "zod";
