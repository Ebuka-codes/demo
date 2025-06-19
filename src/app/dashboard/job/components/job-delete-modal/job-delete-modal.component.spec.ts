import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDeleteModalComponent } from './job-delete-modal.component';

describe('JobDeleteModalComponent', () => {
  let component: JobDeleteModalComponent;
  let fixture: ComponentFixture<JobDeleteModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobDeleteModalComponent]
    });
    fixture = TestBed.createComponent(JobDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
