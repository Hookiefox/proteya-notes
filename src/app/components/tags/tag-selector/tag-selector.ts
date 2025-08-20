import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagService, TagsResponse, Tag } from '../../../services/tag';
import { DialogRef } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tag-selector',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './tag-selector.html',
  styleUrl: './tag-selector.css'
})
export class TagSelector {
  private tagService = inject(TagService);
  private dialogRef = inject(DialogRef<string>);

  allTags$: Observable<TagsResponse> = this.tagService.tags$;

  selectTag(tagId: string): void {
    this.dialogRef.close(tagId);
  }

  close(): void {
    this.dialogRef.close();
  }
}