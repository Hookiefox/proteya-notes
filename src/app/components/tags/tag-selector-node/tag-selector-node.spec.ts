import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSelectorNode } from './tag-selector-node';

describe('TagSelectorNode', () => {
  let component: TagSelectorNode;
  let fixture: ComponentFixture<TagSelectorNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagSelectorNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagSelectorNode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});