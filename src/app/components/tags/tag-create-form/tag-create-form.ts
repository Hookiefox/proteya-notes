import { Component, inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { TagService } from '../../../services/tag';
import { MODAL_DATA, ModalData } from '../../../services/modal';

@Component({
  selector: 'app-tag-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tag-create-form.html',
  styleUrls: ['./tag-create-form.css']
})
export class TagCreateFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tagService = inject(TagService);
  public dialogRef = inject(DialogRef<boolean>);
  private modalData = inject<ModalData>(MODAL_DATA, { optional: true });

  tagForm!: FormGroup;
  parentTagName: string | null = null;

  ngOnInit(): void {
    this.tagForm = this.fb.group({
      name: ['', Validators.required],
      parent_id: [null]
    });

    console.log('TagCreateForm - Modal data received:', this.modalData);
    
    if (this.modalData) {
      if (this.modalData['parentId']) {
        this.tagForm.patchValue({ parent_id: this.modalData['parentId'] });
        console.log('TagCreateForm - Set parent_id to:', this.modalData['parentId']);
      }
      this.parentTagName = this.modalData['parentTagName'] || null;
    }
  }

  onSubmit(): void {
    if (this.tagForm.valid) {
      const { name, parent_id } = this.tagForm.value;
      console.log('TagCreateForm - Submitting tag:', { name, parent_id });
      this.tagService.createTag(name, parent_id).subscribe({
        next: (response) => {
          console.log('TagCreateForm - Tag created successfully:', response);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Failed to create tag', err);
          
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}