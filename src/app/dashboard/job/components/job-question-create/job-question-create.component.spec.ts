import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobQuestionCreateComponent } from './job-question-create.component';

describe('JobQuestionCreateComponent', () => {
  let component: JobQuestionCreateComponent;
  let fixture: ComponentFixture<JobQuestionCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobQuestionCreateComponent]
    });
    fixture = TestBed.createComponent(JobQuestionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
