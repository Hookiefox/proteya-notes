import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note';
import { TagTreeComponent } from '../tags/tag-tree/tag-tree';
import { ModalService } from '../../services/modal';
import { TagManager } from '../tags/tag-manager/tag-manager';
import { SettingsComponent } from '../settings/settings';
import { WorkspaceSelectorComponent } from '../workspaces/workspace-selector/workspace-selector.component';
import { ContextMenuService } from '../../services/context-menu.service';
import { WorkspaceService } from '../../services/workspace.service';
import { AuthService } from '../../services/auth.service';
import { VoiceChannelComponent } from '../voice-channel/voice-channel.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, TagTreeComponent, WorkspaceSelectorComponent, VoiceChannelComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  @Input() isCollapsed = false;
  private noteService = inject(NoteService);
  private modalService = inject(ModalService);
  private contextMenuService = inject(ContextMenuService);
  private workspaceService = inject(WorkspaceService);
  public authService = inject(AuthService);

  notes$ = this.noteService.notes$;
  selectedNote$ = this.noteService.selectedNote$;

  constructor() {}

  ngOnInit() {
    this.workspaceService.loadWorkspaces().subscribe();
  }

  openTagManager(): void {
    this.modalService.open(TagManager, { title: 'Управление тегами' });
  }

  openSettings(): void {
    this.modalService.open(SettingsComponent, { title: 'Настройки' });
  }

  createNewNote(): void {
    this.noteService.requestNewNote();
  }

  selectNote(id: string): void {
    this.noteService.selectNote(id);
  }

  onNoteContextMenu(event: MouseEvent, noteId: string): void {
    event.preventDefault();
    event.stopPropagation();

    const menuItems = [
      { label: 'Удалить', action: 'delete' },
      { label: 'Экспорт', action: 'export' },
    ];

    this.contextMenuService.open(event.clientX, event.clientY, menuItems)
      .subscribe(action => {
        if (action === 'delete') {
          this.noteService.deleteNote(noteId).subscribe();
        } else if (action === 'export') {
          
        }
      });
  }
}