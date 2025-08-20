// proteya-api/src/notes/notes.service.ts

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './interfaces/note.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { FilesService } from '../files/files.service';

const NOTES_DIR = path.join(process.cwd(), 'proteya-api', 'src', 'static', 'notes');

@Injectable()
export class NotesService {
  constructor(private filesService: FilesService) {}

  private getNoteFilepath(filename: string): string {
    return path.join(NOTES_DIR, filename);
  }

  // Соответствует load_all_notes()
  async findAll(): Promise<Note[]> {
    const notes: Note[] = [];
    const files = await fs.promises.readdir(NOTES_DIR);
    for (const filename of files) {
      if (filename.endsWith('.json')) {
        const filepath = this.getNoteFilepath(filename);
        try {
          const fileContent = await fs.promises.readFile(filepath, 'utf-8');
          const note: Note = JSON.parse(fileContent);
          notes.push({ ...note, filename });
        } catch (error) {
          console.error(`Ошибка при чтении файла ${filename}:`, error);
        }
      }
    }
    return notes;
  }

  async findOne(filename: string): Promise<Note> {
    const filepath = this.getNoteFilepath(filename);

    if (!await this.checkFileExists(filepath)) {
      throw new NotFoundException(`Note with filename '${filename}' not found`);
    }

    try {
      const fileContent = await fs.promises.readFile(filepath, 'utf-8');
      const note: Note = JSON.parse(fileContent);
      return { ...note, filename };
    } catch (error) {
      throw new InternalServerErrorException('Error reading note file');
    }
  }

  // Соответствует create_note()
  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const noteId = uuid.v4();
    const filename = `${noteId}.json`;
    const filepath = this.getNoteFilepath(filename);

    // Исправляем ошибку здесь
    const note: Note = {
      id: noteId,
      title: createNoteDto.title,
      content: createNoteDto.content ?? '', // <-- Добавляем fallback на пустую строку
      is_encrypted: createNoteDto.is_encrypted ?? false, // <-- Также добавим для is_encrypted, если оно опционально
      filename,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await fs.promises.mkdir(NOTES_DIR, { recursive: true });
      await fs.promises.writeFile(filepath, JSON.stringify(note, null, 2));

      return note;
    } catch (error) {
      throw new InternalServerErrorException('Не удалось создать заметку');
    }
  }


  // Соответствует update_note()
  async update(filename: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const filepath = this.getNoteFilepath(filename);
    if (!await this.checkFileExists(filepath)) {
      throw new NotFoundException(`Заметка с именем ${filename} не найдена`);
    }

    const currentNoteContent = await fs.promises.readFile(filepath, 'utf-8');
    const currentNote: Note = JSON.parse(currentNoteContent);

    const updatedNote = {
      ...currentNote,
      ...updateNoteDto,
      updated_at: new Date().toISOString(),
    };

    try {
      await fs.promises.writeFile(filepath, JSON.stringify(updatedNote, null, 2));
      return { ...updatedNote, filename };
    } catch (error) {
      throw new InternalServerErrorException('Не удалось обновить заметку');
    }
  }

  // Соответствует delete_note()
  async delete(filename: string): Promise<void> {
    const filepath = this.getNoteFilepath(filename);
    if (!await this.checkFileExists(filepath)) {
      throw new NotFoundException(`Заметка с именем ${filename} не найдена`);
    }

    const noteId = path.parse(filename).name;
    // this.filesService.deleteNoteFiles(noteId); // Не забудьте реализовать этот метод

    try {
      await fs.promises.unlink(filepath);
    } catch (error) {
      throw new InternalServerErrorException('Не удалось удалить заметку');
    }
  }

  private async checkFileExists(filepath: string): Promise<boolean> {
    try {
      await fs.promises.access(filepath, fs.constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }
}