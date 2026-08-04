import { HttpException, HttpStatus } from "@nestjs/common";

// Standardized error codes for logs and API responses (DEC-009) — never free-text messages.
export enum ErrorCode {
  INTERNAL_ERROR = "INTERNAL_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
}

const STATUS_TO_ERROR_CODE: Partial<Record<number, ErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.BAD_REQUEST,
  [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
  [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorCode.VALIDATION_ERROR,
};

export function resolveErrorCode(exception: unknown): ErrorCode {
  if (exception instanceof HttpException) {
    return STATUS_TO_ERROR_CODE[exception.getStatus()] ?? ErrorCode.INTERNAL_ERROR;
  }
  return ErrorCode.INTERNAL_ERROR;
}
