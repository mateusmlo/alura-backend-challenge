import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .setTitle('Aluraflix API')
    .setDescription('Aluraflix API docs')
    .setVersion('0.0.1')
    .addTag('open-beta')
    .build();

  const docs = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, docs);

  await app.listen(3000);
  logger.log(`Application listening on port 3000`);
}
bootstrap();
