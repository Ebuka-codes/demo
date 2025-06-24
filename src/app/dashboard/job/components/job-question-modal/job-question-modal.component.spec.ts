import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobQuestionModalComponent } from './job-question-modal.component';

describe('JobQuestionCreateComponent', () => {
  let component: JobQuestionModalComponent;
  let fixture: ComponentFixture<JobQuestionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobQuestionModalComponent],
    });
    fixture = TestBed.createComponent(JobQuestionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
