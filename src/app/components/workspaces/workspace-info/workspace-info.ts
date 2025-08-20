import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../../services/workspace.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { Workspace } from '../../../models/workspace.model';

@Component({
  selector: 'app-workspace-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace-info.html',
  styleUrls: ['./workspace-info.css']
})
export class WorkspaceInfoComponent {
  workspaceService = inject(WorkspaceService);
  authService = inject(AuthService);

  get currentUser(): User | null {
    return this.authService.currentUserValue;
  }

  get currentWorkspace(): Workspace | null {
    return this.workspaceService.currentWorkspace;
  }
}