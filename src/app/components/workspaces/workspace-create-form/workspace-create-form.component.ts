import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkspaceService } from '../../../services/workspace.service';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-workspace-create-form',
  template: `
    <form [formGroup]="workspaceForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Workspace Name">
      <button type="submit" [disabled]="workspaceForm.invalid">Create</button>
    </form>
  `
})
export class WorkspaceCreateFormComponent {
  private fb = inject(FormBuilder);
  private workspaceService = inject(WorkspaceService);
  private dialogRef = inject(DialogRef);

  workspaceForm: FormGroup = this.fb.group({
    name: ['', Validators.required]
  });

  onSubmit() {
    if (this.workspaceForm.valid) {
      this.workspaceService.createWorkspace(this.workspaceForm.value.name).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }
}