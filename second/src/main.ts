import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupAppSwagger } from './swagger';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';
import { AppConfigService } from './common/modules/config/app-config.service';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule, { cors: true });
  
  
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://apex:apex@192.168.0.106:5672'],
      queue: 'apex_queue',
    },
  });
  
  
    const conf: AppConfigService = app.get(AppConfigService);
  
    app.useGlobalPipes(new GlobalValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ErrorInterceptor());
  
    if (!conf.isProduction) {
      setupAppSwagger(app);
    }
  
    app.enableShutdownHooks();
    await microservice.listen();
    await app.listen(conf.port, async () => {
      console.info(`Application running at ${await app.getUrl()}`);
    });
  }

bootstrap();
