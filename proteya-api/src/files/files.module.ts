import { Module } from '@nestjs/common';
import { FilesService } from './files.service';

@Module({
  providers: [FilesService],
  exports: [FilesService], // <--- Экспортируем, чтобы другие модули могли использовать
})
export class FilesModule {}