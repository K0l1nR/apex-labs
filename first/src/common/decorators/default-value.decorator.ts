import { Transform } from 'class-transformer';

export function DefaultValue(defaultValue: any): PropertyDecorator {
  return Transform(({ value }) => (value !== undefined ? value : defaultValue));
}
