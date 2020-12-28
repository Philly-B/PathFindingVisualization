import { TestBed } from '@angular/core/testing';

import { P5UtilService } from './p5-util.service';

describe('P5UtilService', () => {
  let service: P5UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P5UtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
