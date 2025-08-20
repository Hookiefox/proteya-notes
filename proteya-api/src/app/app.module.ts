// proteya-api/src/app/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from '../notes/notes.module'; // <-- Добавляем импорт

@Module({
  imports: [
    NotesModule // <-- Добавляем модуль сюда
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}