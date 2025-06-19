import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobViewModalComponent } from './job-view-modal.component';

describe('JobViewModalComponent', () => {
  let component: JobViewModalComponent;
  let fixture: ComponentFixture<JobViewModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobViewModalComponent]
    });
    fixture = TestBed.createComponent(JobViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
