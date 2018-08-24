import { TestBed, inject } from '@angular/core/testing';

import { BloggerService } from './BloggerService';

describe('BloggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BloggerService]
    });
  });

  it('should be created', inject([BloggerService], (service: BloggerService) => {
    expect(service).toBeTruthy();
  }));
});
