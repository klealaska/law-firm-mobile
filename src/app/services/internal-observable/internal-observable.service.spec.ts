import { TestBed } from '@angular/core/testing';

import { InternalObservableService } from './internal-observable.service';

describe('InternalObservableService', () => {
  let service: InternalObservableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalObservableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
