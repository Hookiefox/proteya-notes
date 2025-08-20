// proteya-api/src/notes/notes.controller.ts

import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  HttpCode,
  UseInterceptors,     // <-- Новый импорт
  UploadedFile        // <-- Новый импорт
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // <-- Новый импорт

import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

// Добавляем импорт для типа файла
import { Express } from 'express'; 
import { FilesService } from '../files/files.service';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly filesService: FilesService // <-- Внедряем FilesService
  ) {}

  @Get()
  async findAll() {
    return this.notesService.findAll();
  }

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }
  
  @Get(':filename')
  async findOne(@Param('filename') filename: string) {
      return this.notesService.findOne(filename);
  }

  @Put(':filename')
  async update(@Param('filename') filename: string, @Body() updateNoteDto: UpdateNoteDto) {
      return this.notesService.update(filename, updateNoteDto);
  }
  
  @Delete(':filename')
  @HttpCode(204)
  async delete(@Param('filename') filename: string) {
      await this.notesService.delete(filename);
  }
  
  // Новый метод для загрузки файлов
  @Post(':filename/upload')
  // FileInterceptor('file') - 'file' должно соответствовать имени поля в multipart/form-data
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('filename') filename: string, 
    @UploadedFile() file: Express.Multer.File
  ) {
    // Вся логика работы с файлом вынесена в сервис
    const fileUrl = await this.filesService.uploadFile(filename, file);
    return { 
      message: 'File uploaded successfully', 
      fileUrl 
    };
  }

}