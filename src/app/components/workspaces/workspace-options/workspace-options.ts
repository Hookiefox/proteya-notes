import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../../services/workspace.service';
import { ModalService } from '../../../services/modal';
import { WorkspaceEditFormComponent } from '../workspace-edit-form/workspace-edit-form';
import { UserManagementComponent } from '../../../services/user-management/user-management.component';

@Component({
  selector: 'app-workspace-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace-options.html',
  styleUrls: ['./workspace-options.css']
})
export class WorkspaceOptionsComponent {
  private workspaceService = inject(WorkspaceService);
  private modalService = inject(ModalService);

  editWorkspace(): void {
    const currentWorkspace = this.workspaceService.currentWorkspace;
    if (currentWorkspace) {
      this.modalService.open(WorkspaceEditFormComponent, {
        title: 'Edit Workspace',
        id: currentWorkspace.id,
        name: currentWorkspace.name
      });
    }
  }

  manageUsers(): void {
    this.modalService.open(UserManagementComponent, { title: 'Manage Users' });
  }

  leaveWorkspace(): void {
    if (confirm('Are you sure you want to leave this workspace?')) {
      this.workspaceService.leaveWorkspace().subscribe();
    }
  }

  deleteWorkspace(): void {
    if (confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      this.workspaceService.deleteWorkspace().subscribe();
    }
  }
}