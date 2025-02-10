import { TestBed } from '@angular/core/testing';

import { JobRecruitService } from './job-recruit.service';

describe('JobRecruitService', () => {
  let service: JobRecruitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobRecruitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
