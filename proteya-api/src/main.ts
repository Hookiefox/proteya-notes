// proteya-api/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; // <-- Новый импорт
import { join } from 'path'; // <-- Новый импорт

async function bootstrap() {
  // Указываем, что хотим использовать Express-приложение
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());

  // Настраиваем отдачу статических файлов
  // 'static' - это папка, где лежат файлы
  // '/static' - это URL-префикс, по которому файлы будут доступны
  app.useStaticAssets(join(__dirname, '..', 'static'), {
    prefix: '/static/', // Обязательный префикс для URL
  });

  await app.listen(3000);
}
bootstrap();