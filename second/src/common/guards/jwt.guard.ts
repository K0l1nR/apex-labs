import { Injectable, UnauthorizedException, ExecutionContext, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  private readonly client: ClientProxy;

  constructor() {
    super();
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://apex:apex@192.168.0.106:5672'],
        queue: 'apex_queue',
      },
    });
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
  
    if (!request.headers) {
      throw new UnauthorizedException('Request headers are missing');
    }
  
    const authHeader = request.headers['authorization'];

  
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
  
    const tokenParts = authHeader.split(' ');
  
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      throw new UnauthorizedException('Malformed authorization header');
    }
  
    const token = tokenParts[1];
    return this.client.send({ cmd: 'validate_token' },{ token }) // Отправляем только токен
      .toPromise()
      .then((response) => {
        request.user = response.user; // Сохраняем данные пользователя из ответа
        return true;
      })
      .catch(error => {
        this.logger.error(`Token validation error: ${error.message}`);
        throw new UnauthorizedException('Token validation failed');
      });
  }
  
  
}
