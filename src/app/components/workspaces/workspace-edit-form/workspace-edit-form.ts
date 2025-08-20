import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { WorkspaceService } from '../../../services/workspace.service';
import { MODAL_DATA, ModalData } from '../../../services/modal';

@Component({
  selector: 'app-workspace-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './workspace-edit-form.html',
  styleUrls: ['./workspace-edit-form.css']
})
export class WorkspaceEditFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private workspaceService = inject(WorkspaceService);
  public dialogRef = inject(DialogRef<boolean>);
  private modalData = inject<ModalData>(MODAL_DATA, { optional: true });

  workspaceForm!: FormGroup;
  workspaceId!: string;

  ngOnInit(): void {
    this.workspaceForm = this.fb.group({
      name: ['', Validators.required]
    });

    if (this.modalData) {
      this.workspaceId = this.modalData['id'];
      this.workspaceForm.patchValue({ name: this.modalData['name'] });
    }
  }

  onSubmit(): void {
    if (this.workspaceForm.valid && this.workspaceId) {
      this.workspaceService.updateWorkspace(this.workspaceId, this.workspaceForm.value.name).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}