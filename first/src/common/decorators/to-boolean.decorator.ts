import { Transform } from 'class-transformer';

export function ToBoolean(): PropertyDecorator {
  return Transform(({ value }) => {
    const available = ['true', 'false'];

    if (typeof value === 'undefined') {
      return;
    }

    if (!available.includes(value)) {
      return value;
    }

    return value === 'true';
  });
}
