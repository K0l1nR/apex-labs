import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionError = exception.getResponse();

    const json: Record<string, any> =
      typeof exceptionError === 'object' ? exceptionError : {};

    json.statusCode = status;
    json.timestamp = new Date().toISOString();
    json.path = request.url;

    response.status(status).json(json);
  }
}
