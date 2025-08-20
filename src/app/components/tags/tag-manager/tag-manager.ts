import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagService, Tag, TagsResponse } from '../../../services/tag';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TagListItem } from '../tag-list-item/tag-list-item';
import { ModalService } from '../../../services/modal';
import { TagEditFormComponent } from '../tag-edit-form/tag-edit-form';
import { TagCreateFormComponent } from '../tag-create-form/tag-create-form';

@Component({
  selector: 'app-tag-manager',
  standalone: true,
  imports: [CommonModule, TagListItem],
  templateUrl: './tag-manager.html',
  styleUrl: './tag-manager.css'
})
export class TagManager implements OnInit {
  private tagService = inject(TagService);
  private modalService = inject(ModalService);

  allTags$: Observable<TagsResponse> = this.tagService.tags$;
  rootTags$ = this.allTags$.pipe(
    map(tags => Object.values(tags).filter(tag => tag.parent_id === null))
  );

  ngOnInit(): void {}

  showCreateForm(parentId: string | null = null): void {
    if (parentId) {
      this.allTags$.pipe(take(1)).subscribe(tags => {
        const parentTagName = tags[parentId]?.name || null;
        console.log('Opening create form for child tag:', { parentId, parentTagName });
        this.modalService.open(TagCreateFormComponent, {
          title: 'Создать дочерний тег',
          parentId,
          parentTagName
        });
      });
    } else {
      console.log('Opening create form for root tag');
      this.modalService.open(TagCreateFormComponent, {
        title: 'Создать новый тег'
      });
    }
  }

  showEditForm(tag: Tag): void {
    this.modalService.open(TagEditFormComponent, { 
      title: 'Редактировать тег',
      id: tag.id,
      name: tag.name
    });
  }

  deleteTag(id: string): void {
    if (confirm('Вы уверены, что хотите удалить этот тег и все дочерние? Это действие необратимо.')) {
      this.tagService.deleteTag(id).subscribe();
    }
  }
}