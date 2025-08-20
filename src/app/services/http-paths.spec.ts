import { TestBed } from '@angular/core/testing';

import { HttpPaths } from './http-paths';

describe('HttpPaths', () => {
  let service: HttpPaths;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpPaths);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});