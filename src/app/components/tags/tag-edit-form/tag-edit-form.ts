import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { TagService } from '../../../services/tag';
import { MODAL_DATA, ModalData } from '../../../services/modal';

@Component({
  selector: 'app-tag-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tag-edit-form.html',
  styleUrls: ['./tag-edit-form.css']
})
export class TagEditFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tagService = inject(TagService);
  public dialogRef = inject(DialogRef<boolean>);
  private modalData = inject<ModalData>(MODAL_DATA, { optional: true });

  tagForm!: FormGroup;
  tagId!: string;

  ngOnInit(): void {
    this.tagForm = this.fb.group({
      name: ['', Validators.required]
    });

    if (this.modalData) {
      this.tagId = this.modalData['id'];
      this.tagForm.patchValue({ name: this.modalData['name'] });
    }
  }

  onSubmit(): void {
    if (this.tagForm.valid && this.tagId) {
      this.tagService.updateTag(this.tagId, this.tagForm.value.name).subscribe(() => {
        this.dialogRef.close(true); 
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}