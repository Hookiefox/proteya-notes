import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Tag, TagsResponse } from '../../../services/tag';

@Component({
  selector: 'app-tag-selector-node',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TagSelectorNode], 
  templateUrl: './tag-selector-node.html',
  styleUrl: './tag-selector-node.css'
})
export class TagSelectorNode {
  @Input({ required: true }) tag!: Tag;
  @Input({ required: true }) allTags!: TagsResponse;
  @Input({ required: true }) formGroup!: FormGroup;
}