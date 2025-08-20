import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag, TagsResponse } from '../../../services/tag';
import { NoteService } from '../../../services/note';
import { Observable } from 'rxjs';
import { ColorFilterUtil } from '../../../utils/color-filter';

@Component({
  selector: 'app-tag-node',
  standalone: true,
  imports: [CommonModule, TagNodeComponent],
  templateUrl: './tag-node.html',
  styleUrl: './tag-node.css'
})
export class TagNodeComponent {
  @Input({ required: true }) tag!: Tag;
  @Input({ required: true }) allTags!: TagsResponse;

  private noteService = inject(NoteService);
  selectedTagId$: Observable<string | null> = this.noteService.selectedTagId$;

  
  isExpanded = false;

  
  toggleExpansion(event: MouseEvent): void {
    event.stopPropagation();
    if (this.tag.children.length > 0) {
      this.isExpanded = !this.isExpanded;
    }
  }

  
  filterByThisTag(): void {
    this.noteService.filterByTag(this.tag.id);
  }

  getIconColor(color: string | undefined): string {
    return color ? ColorFilterUtil.getIconColor(color) : '';
  }
}