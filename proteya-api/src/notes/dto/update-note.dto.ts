// proteya-api/src/notes/dto/update-note.dto.ts
import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  title!: string; // <-- Добавляем '!'

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  is_encrypted?: boolean;
}