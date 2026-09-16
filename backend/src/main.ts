import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.use(cookieParser());

  
  
  app.useGlobalPipes(new ValidationPipe());

  
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true, 
  });
const port = process.env.PORT || 3001;

  await app.listen(port);
  console.log(`🚀 Backend running at http://localhost:${port}`);
  console.log(`📊 GraphQL playground at http://localhost:${port}/graphql`);
}

bootstrap();
