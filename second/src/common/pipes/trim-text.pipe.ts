import {
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class TrimTextPipe implements PipeTransform {
  public transform(dto: object | string): unknown {
    if (typeof dto === 'string') {
      return dto.trim();
    }

    for (const property in dto) {
      if (typeof dto[property] === 'string' && dto[property].length !== 0) {
        try {
          const trimedText = dto[property].trim();

          dto[property] = trimedText;
        } catch (error) {
          throw new InternalServerErrorException(
            `[TrimTextPipe] Method: transform; value doesn't support operation trim. value: ${property}
            Error: ${error}`,
          );
        }
      }
    }

    return dto;
  }
}
