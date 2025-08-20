import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagNode } from './tag-node';

describe('TagNode', () => {
  let component: TagNode;
  let fixture: ComponentFixture<TagNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagNode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});