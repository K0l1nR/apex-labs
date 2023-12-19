import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      catchError((err) => {
        if (!(err instanceof HttpException)) {
          this.logger.error(
            err.message,
            err.stack,
            context.getClass().name,
            req.user?.userId ?? 'none',
          );
          throw new InternalServerErrorException(err.message);
        }

        return throwError(() => err);
      }),
    );
  }
}
