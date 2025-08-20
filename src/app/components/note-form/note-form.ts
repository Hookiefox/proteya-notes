import { Component, inject, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoteService, Note } from '../../services/note';
import { TagService } from '../../services/tag';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal';
import { TagSelector } from '../tags/tag-selector/tag-selector';
import { map } from 'rxjs/operators';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Quill from 'quill';
import VideoBlot from '../../quill-video-blot';
import { AbsoluteUrlPipe } from '../../pipes/absolute-url.pipe';

import { HttpPaths } from '../../services/http-paths';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, AbsoluteUrlPipe],
  templateUrl: './note-form.html',
  styleUrl: './note-form.css',
  host: {
    '[class.read-mode]': 'readMode'
  }
})
export class NoteForm implements OnInit {
  @ViewChild(QuillEditorComponent, { static: false }) editor!: QuillEditorComponent;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  private noteService = inject(NoteService);
  private modalService = inject(ModalService);
  private tagService = inject(TagService);
  private http = inject(HttpClient);
  private httpPaths = inject(HttpPaths);
  private cdr = inject(ChangeDetectorRef);


  modules = {
    toolbar: {
      container: '#toolbar' 
    }
  };

  noteForm: FormGroup = this.fb.group({
    id: [null],
    title: [''],
    content: [''],
    tags: [[] as string[]]
  });

  private currentNote: Note | null = null;
  isNoteSelected: boolean = false;
  readMode: boolean = false;

  constructor() {
    if (!Quill.imports['blots/video']) {
      Quill.register(VideoBlot, true);
    }
  }

  ngOnInit(): void {
    this.noteService.selectedNote$.subscribe(note => {
      this.currentNote = note;
      if (note) {
        this.noteForm.patchValue(note);
        this.isNoteSelected = true;
      } else {
        this.noteForm.reset({ id: null, title: '', content: '', tags: [] });
        this.isNoteSelected = false;
      }
      this.cdr.detectChanges(); 
    });

    this.noteService.newNoteRequested$.subscribe(() => {
      this.noteForm.reset({ id: null, title: '', content: '', tags: [] });
      this.isNoteSelected = true;
    });
  }

  getTagName(tagId: string) {
    return this.tagService.tags$.pipe(
      map(tags => tags[tagId]?.name || '...')
    );
  }

  openTagSelector(): void {
    const dialogRef = this.modalService.open(TagSelector);

    dialogRef.closed.subscribe(tagId => {
      if (tagId) {
        const currentTags = this.noteForm.get('tags')?.value || [];
        if (!currentTags.includes(tagId)) {
          this.noteForm.patchValue({ tags: [...currentTags, tagId] });
        }
      }
    });
  }

  removeTag(tagId: string): void {
    const currentTags = this.noteForm.get('tags')?.value || [];
    this.noteForm.patchValue({ tags: currentTags.filter((id: string) => id !== tagId) });
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
      if (this.currentNote && this.currentNote.filename) {
        this.noteService.updateNote(this.currentNote.filename, this.noteForm.value).subscribe();
      } else {
        this.noteService.createNote(this.noteForm.value).subscribe();
      }
    }
  }

  deleteNote(): void {
    if (this.currentNote && this.currentNote.filename) {
      const dialogRef = this.modalService.open(ConfirmDialogComponent);
      dialogRef.closed.subscribe(confirmed => {
        if (confirmed) {
          this.noteService.deleteNote(this.currentNote!.filename).subscribe();
        }
      });
    }
  }

  onNewNote(): void {
    this.noteService.requestNewNote();
  }

  toggleReadMode(): void {
    this.readMode = !this.readMode;
  }

  addFile(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    if (!this.currentNote || !this.currentNote.id) {
      alert('Пожалуйста, сначала сохраните заметку, прежде чем добавлять вложения.');
      return;
    }
    const noteId = this.currentNote.id;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const formData = new FormData();
      formData.append('file', file);

      this.http.post<{ location: string }>(`${this.httpPaths.notes}${noteId}/attachments`, formData).subscribe({
        next: (response) => {
          const quill = this.editor.quillEditor;
          quill.focus();
          let range = quill.getSelection() || { index: quill.getLength(), length: 0 };
          
          const isVideo = file.type.startsWith('video/');
          const isImage = file.type.startsWith('image/');

          if (isVideo) {
            quill.insertEmbed(range.index, 'video', this.httpPaths.baseApiUrl + response.location, 'user');
          } else if (isImage) {
            quill.insertEmbed(range.index, 'image', this.httpPaths.baseApiUrl + response.location, 'user');
          } else {
            
            quill.insertText(range.index, file.name, 'link', this.httpPaths.baseApiUrl + response.location);
          }
          quill.setSelection(range.index + 1, 0);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Ошибка при загрузке файла:', error);
          alert('Не удалось загрузить файл.');
        }
      });
    }
  }
}
