import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class DTOTransformInterceptor<T, V>
  implements NestInterceptor<V, T | T[]>
{
  constructor(private DataType: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T | T[]> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest<Request>();

        if (Array.isArray(data)) {
          const json: V[] = data.map((item) => {
            item = item?.toJSON ? item.toJSON() : item;
            item.req = req;

            return item;
          });

          return plainToInstance(this.DataType, json);
        } else {
          let json: Record<string, any> = { req };

          const payload = data?.toJSON ? data.toJSON() : data;

          if (payload) {
            json = { ...json, ...payload };
          }

          return plainToInstance(this.DataType, json ?? {});
        }
      }),
    );
  }
}
