// proteya-api/src/notes/notes.module.ts

import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { FilesModule } from '../files/files.module'; // Импортируем FilesModule, потому что NotesController его использует

@Module({
  imports: [FilesModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}