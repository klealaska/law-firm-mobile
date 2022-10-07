import { TestBed } from '@angular/core/testing';

import { TaxNewsService } from './tax-news.service';

describe('TaxNewsService', () => {
  let service: TaxNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
