import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note';
import { NoteForm } from '../note-form/note-form';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, NoteForm],
  templateUrl: './content.html',
  styleUrl: './content.css'
})
export class Content {
  noteService = inject(NoteService);
  selectedNote$ = this.noteService.selectedNote$;
}