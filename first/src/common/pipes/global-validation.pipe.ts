import {
  BadRequestException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export type ValidationMessages = Record<string, string[]>;

export interface ValidationExceptionObject {
  statusCode: number;
  errors: ValidationMessages;
  error: string;
}

export class GlobalValidationPipe extends ValidationPipe {
  protected exceptionFactory: (errors: ValidationError[]) => any = (errors) => {
    const errorObj: ValidationExceptionObject = {
      statusCode: HttpStatus.BAD_REQUEST,
      errors: this.customFormat(errors),
      error: 'Bad Request',
    };
    return new BadRequestException(errorObj);
  };

  customFormat(validationErrors: ValidationError[]): ValidationMessages {
    return validationErrors.reduce<ValidationMessages>((prev, acc) => {
      prev[acc.property] = Object.values(acc.constraints);
      return prev;
    }, {});
  }
}
