import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag, TagsResponse } from '../../../services/tag';
import { ColorFilterUtil } from '../../../utils/color-filter';

@Component({
  selector: 'app-tag-list-item',
  standalone: true,
  imports: [CommonModule, TagListItem],
  templateUrl: './tag-list-item.html',
  styleUrl: './tag-list-item.css'
})
export class TagListItem {
  @Input({ required: true }) tag!: Tag;
  @Input({ required: true }) allTags!: TagsResponse;

  @Output() edit = new EventEmitter<Tag>();
  @Output() addChild = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  getIconColor(color: string | undefined): string {
    return color ? ColorFilterUtil.getIconColor(color) : '';
  }
}