import {
  ClassConstructor,
  plainToInstance,
  Transform,
} from 'class-transformer';

export function TypeFile<T>(Dto: ClassConstructor<T>): PropertyDecorator {
  return Transform(({ obj, value }) =>
    value ? plainToInstance(Dto, { ...value, req: obj.req }) : null,
  );
}
