import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap, combineLatest, map, switchMap, of } from 'rxjs';
import { EncryptionService } from './encryption';
import { ModalService } from './modal';
import { EnterPasswordComponent } from '../components/enter-password/enter-password';
import { HttpPaths } from './http-paths';
import { WorkspaceService } from './workspace.service';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  filename: string;
  is_encrypted?: boolean;
  created_at?: string;
  modified_at?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private http = inject(HttpClient);
  private encryptionService = inject(EncryptionService);
  private modalService = inject(ModalService);
  private workspaceService = inject(WorkspaceService);
  private httpPaths = inject(HttpPaths);

  private readonly _allNotes$ = new BehaviorSubject<Note[]>([]);
  private readonly _selectedTagId$ = new BehaviorSubject<string | null>(null);
  private readonly _selectedNote$ = new BehaviorSubject<Note | null>(null);
  private readonly _newNoteRequest$ = new Subject<void>();

  public readonly notes$: Observable<Note[]>;
  public readonly selectedNote$ = this._selectedNote$.asObservable();
  public readonly selectedTagId$ = this._selectedTagId$.asObservable();
  public readonly newNoteRequested$ = this._newNoteRequest$.asObservable();

    constructor() {
    this.workspaceService.activeWorkspaceId$.pipe(
      tap(() => this.selectNote(null)),
      switchMap((workspaceId) => this.loadNotes(workspaceId))
    ).subscribe();

    this.notes$ = combineLatest([
      this._allNotes$,
      this._selectedTagId$
    ]).pipe(
      map(([allNotes, selectedTagId]) => {
        if (!selectedTagId) {
          return allNotes;
        }
        return allNotes.filter(note => note.tags.includes(selectedTagId));
      }),
      map(notes => notes.sort((a, b) => {
        if (!a.modified_at || !b.modified_at) return 0;
        return new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime();
      }))
    );
  }

  loadNotes(workspaceId: string): Observable<Note[]> {
    if (!workspaceId) {
      return of([]);
    }
    const params = new HttpParams().set('workspace_id', workspaceId);
    return this.http.get<Note[]>(this.httpPaths.notes, { params }).pipe(
      tap(notes => {
        console.log('Loaded notes for workspace ' + workspaceId + ':', notes);
        this._allNotes$.next(notes);
      })
    );
  }

  selectNote(id: string | null): void {
    if (id === null) {
      this._selectedNote$.next(null);
      return;
    }
    const note = this._allNotes$.getValue().find(n => n.id === id);
    if (!note) {
      this._selectedNote$.next(null);
      return;
    }

    if (note.is_encrypted) {
      if (this.encryptionService.hasPassword()) {
        try {
          const decryptedContent = this.encryptionService.decrypt(note.content);
          const decryptedNote = { ...note, content: decryptedContent };
          this._selectedNote$.next(decryptedNote);
        } catch (e) {
          this.promptForPasswordAndSelectNote(note);
        }
      } else {
        this.promptForPasswordAndSelectNote(note);
      }
    } else {
      this._selectedNote$.next(note);
    }
  }

  private promptForPasswordAndSelectNote(note: Note): void {
    const modalRef = this.modalService.open(EnterPasswordComponent);
    modalRef.closed.subscribe(password => {
      if (password) {
        this.encryptionService.setPassword(password);
        try {
          const decryptedContent = this.encryptionService.decrypt(note.content);
          const decryptedNote = { ...note, content: decryptedContent };
          this._selectedNote$.next(decryptedNote);
        } catch (e) {
          alert('Неверный пароль');
          this._selectedNote$.next(null);
        }
      }
    });
  }

  filterByTag(tagId: string | null): void {
    this._selectedTagId$.next(tagId);
    this.selectNote(null);
  }

  requestNewNote(): void {
    this.selectNote(null);
    this._newNoteRequest$.next();
  }

  createNote(note: { title: string, content: string, tags: string[], type?: string }): Observable<Note> {
    const isEncrypted = this.encryptionService.isEncryptionEnabled();
    let contentToSave = note.content;
    if (isEncrypted && this.encryptionService.hasPassword()) {
      contentToSave = this.encryptionService.encrypt(note.content);
    } else if (isEncrypted && !this.encryptionService.hasPassword()){
      alert("Пароль не задан, заметка не будет зашифрована");
      return of({} as Note);
    }

    const formData = new FormData();
    formData.append('title', note.title);
    formData.append('content', contentToSave);
    formData.append('tags', JSON.stringify(note.tags));
    formData.append('is_encrypted', String(isEncrypted));
    formData.append('workspace_id', this.workspaceService.getActiveWorkspaceId());
    if (note.type) {
      formData.append('type', note.type);
    }

    return this.http.post<Note>(this.httpPaths.notes, formData).pipe(
      tap(newNoteFromServer => {
        const currentNotes = this._allNotes$.getValue();
        this._allNotes$.next([...currentNotes, newNoteFromServer]);
        this.selectNote(newNoteFromServer.id);
      })
    );
  }

  updateNote(filename: string, note: { title: string, content: string, tags: string[] }): Observable<Note> {
    const isEncrypted = this.encryptionService.isEncryptionEnabled();
    let contentToSave = note.content;

    if (isEncrypted && this.encryptionService.hasPassword()) {
      contentToSave = this.encryptionService.encrypt(note.content);
    } else if (isEncrypted && !this.encryptionService.hasPassword()){
      alert("Пароль не задан, заметка не будет зашифрована");
      return of({} as Note);
    }

    const formData = new FormData();
    formData.append('title', note.title);
    formData.append('content', contentToSave);
    formData.append('tags', JSON.stringify(note.tags));
    formData.append('is_encrypted', String(isEncrypted));
    formData.append('workspace_id', this.workspaceService.getActiveWorkspaceId());

    return this.http.put<Note>(`${this.httpPaths.notes}${filename}`, formData).pipe(
      tap(updatedNoteFromServer => {
        const currentNotes = this._allNotes$.getValue();
        const index = currentNotes.findIndex(n => n.id === updatedNoteFromServer.id);
        if (index !== -1) {
          currentNotes[index] = updatedNoteFromServer;
          this._allNotes$.next([...currentNotes]);
        }
      })
    );
  }

  deleteNote(filename: string): Observable<any> {
    const workspaceId = this.workspaceService.getActiveWorkspaceId();
    const params = new HttpParams().set('workspace_id', workspaceId);
    return this.http.delete(`${this.httpPaths.notes}${filename}`, { params }).pipe(
      switchMap(() => this.loadNotes(workspaceId)),
      tap(() => {
        this.selectNote(null);
      })
    );
  }

  reloadNotes(): void {
    const activeWorkspaceId = this.workspaceService.getActiveWorkspaceId();
    if (activeWorkspaceId) {
      this.loadNotes(activeWorkspaceId).subscribe();
    }
  }
}
