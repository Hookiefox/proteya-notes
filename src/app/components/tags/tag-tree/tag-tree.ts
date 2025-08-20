import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagService, TagsResponse } from '../../../services/tag';
import { NoteService } from '../../../services/note'; 
import { TagNodeComponent } from '../tag-node/tag-node';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tag-tree',
  standalone: true,
  imports: [CommonModule, TagNodeComponent],
  templateUrl: './tag-tree.html',
  styleUrl: './tag-tree.css'
})
export class TagTreeComponent {
  private tagService = inject(TagService);
  private noteService = inject(NoteService); 

  allTags$: Observable<TagsResponse> = this.tagService.tags$;
  selectedTagId$: Observable<string | null> = this.noteService.selectedTagId$;

  rootTags$ = this.allTags$.pipe(
    map(tags => Object.values(tags).filter(tag => tag.parent_id === null))
  );

  
  clearFilter(): void {
    this.noteService.filterByTag(null);
  }
}