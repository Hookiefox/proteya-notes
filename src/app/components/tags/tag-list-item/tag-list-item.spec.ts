import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagListItem } from './tag-list-item';

describe('TagListItem', () => {
  let component: TagListItem;
  let fixture: ComponentFixture<TagListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagListItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagListItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});