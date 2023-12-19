import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export type SearchOptions = Partial<{
  required: boolean;
}>;

export const Search = (options: SearchOptions = {}): ParameterDecorator =>
  createParamDecorator((_, ctx: ExecutionContext) => {
    const { required = false } = options;

    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const searchString: string = query?.q ?? '';

    if (required && !searchString) {
      throw new BadRequestException(
        "[SearchDecorator] param 'q' should be defined!",
      );
    }

    return searchString.trim();
  })();
