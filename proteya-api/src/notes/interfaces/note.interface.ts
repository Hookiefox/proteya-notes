// proteya-api/src/notes/interfaces/note.interface.ts
export interface Note {
  id: string; // <-- Добавляем id
  title: string;
  content: string;
  is_encrypted: boolean;
  filename: string;
  created_at: string;
  updated_at: string; // <-- Убедимся, что используется именно updated_at
}