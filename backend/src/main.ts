import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    //origin: 'http://localhost:5173',
    origin: '*', // Permette tutte le origini, utile per lo sviluppo
  });
  await app.listen(3000);
}
bootstrap();
