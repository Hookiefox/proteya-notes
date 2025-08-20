import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagTree } from './tag-tree';

describe('TagTree', () => {
  let component: TagTree;
  let fixture: ComponentFixture<TagTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagTree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagTree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});