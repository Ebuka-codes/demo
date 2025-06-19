import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobFilterModalComponent } from './job-filter-modal.component';

describe('JobFilterModalComponent', () => {
  let component: JobFilterModalComponent;
  let fixture: ComponentFixture<JobFilterModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobFilterModalComponent],
    });
    fixture = TestBed.createComponent(JobFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
