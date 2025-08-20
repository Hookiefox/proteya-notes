// proteya-api/src/files/files.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  // Путь к директории для статических файлов, которую вы монтировали в FastAPI
  private readonly FILES_SUBDIR = 'files';
  private readonly STATIC_DIR = path.join(__dirname, '..', '..', 'static');
  private readonly FILES_DIR = path.join(this.STATIC_DIR, this.FILES_SUBDIR);

  constructor() {
    // Убедимся, что папки существуют при запуске приложения
    fs.mkdirSync(this.FILES_DIR, { recursive: true });
  }

  /**
   * Возвращает путь к папке для файлов заметки, создавая её, если она не существует.
   * @param noteId ID заметки
   * @returns Путь к папке
   */
  public getNoteFilesDir(noteId: string): string {
    const noteFilesDir = path.join(this.FILES_DIR, `note_${noteId}`);
    fs.mkdirSync(noteFilesDir, { recursive: true });
    return noteFilesDir;
  }

  /**
   * Загружает файл и сохраняет его в папку, связанную с заметкой.
   * @param noteId ID заметки
   * @param file Объект файла из запроса
   * @returns URL к загруженному файлу
   */
  public async uploadFile(noteId: string, file: Express.Multer.File): Promise<string> {
    
    const noteFilesDir = this.getNoteFilesDir(noteId);
    
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${uuid.v4()}${fileExtension}`;
    const filePath = path.join(noteFilesDir, uniqueFilename);

    try {
      // Запись файла в асинхронном режиме
      await fs.promises.writeFile(filePath, file.buffer as unknown as Uint8Array);
      // Возврат URL для фронтенда
      return `/${this.FILES_SUBDIR}/note_${noteId}/${uniqueFilename}`;
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  /**
   * Удаляет папку со всеми файлами, связанными с заметкой.
   * @param noteId ID заметки
   */
  public deleteNoteFiles(noteId: string): void {
    const noteFilesDir = path.join(this.FILES_DIR, `note_${noteId}`);
    
    // Проверяем, существует ли папка, прежде чем удалять
    if (fs.existsSync(noteFilesDir)) {
      try {
        // Рекурсивное удаление папки
        fs.rmSync(noteFilesDir, { recursive: true, force: true });
      } catch (error) {
        console.error(`Ошибка при удалении папки для заметки ${noteId}:`, error);
        // Не выбрасываем исключение, чтобы не прерывать процесс удаления заметки
      }
    }
  }
}