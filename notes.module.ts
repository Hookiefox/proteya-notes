import { Module } from '@nestjs/common';
import { NotesModule } from './proteya-api/src/notes.module';
import { NotesModule } from './proteya-api/src/notes/notes.module';

@Module({
  imports: [NotesModule],
})
export class NotesModule {}
