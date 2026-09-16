import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.use(cookieParser());

  
  
  app.useGlobalPipes(new ValidationPipe());

  
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, 
  });

  await app.listen(3001);
  console.log('🚀 Backend running at http://localhost:3001');
  console.log('📊 GraphQL playground at http://localhost:3001/graphql');
}

bootstrap();
