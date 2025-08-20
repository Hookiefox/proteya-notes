// proteya-api/src/notes/dto/create-note.dto.ts
import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  // Изменяем с isEncrypted на is_encrypted
  @IsOptional()
  @IsBoolean()
  is_encrypted?: boolean;
}