import { Component, inject } from '@angular/core';
import { WorkspaceService } from '../../../services/workspace.service';
import { ModalService } from '../../../services/modal';
import { WorkspaceCreateFormComponent } from '../workspace-create-form/workspace-create-form.component';

@Component({
  selector: 'app-workspace-selector',
  template: `
    <div>
      <select (change)="onWorkspaceSelected($event)">
        <option *ngFor="let ws of (workspaces$ | async)" [value]="ws.id" [selected]="ws.id === (currentWorkspace$ | async)?.id">
          {{ ws.name }}
        </option>
      </select>
      <button (click)="openCreateWorkspaceModal()">+</button>
    </div>
  `
})
export class WorkspaceSelectorComponent {
  private workspaceService = inject(WorkspaceService);
  private modalService = inject(ModalService);

  workspaces$ = this.workspaceService.workspaces$;
  currentWorkspace$ = this.workspaceService.currentWorkspace$;

  onWorkspaceSelected(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.workspaceService.setCurrentWorkspace(target.value);
  }

  openCreateWorkspaceModal() {
    this.modalService.open(WorkspaceCreateFormComponent, { title: 'Create Workspace' });
  }
}
