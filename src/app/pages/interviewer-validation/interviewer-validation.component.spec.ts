import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerValidationComponent } from './interviewer-validation.component';

describe('InterviewerValidationComponent', () => {
  let component: InterviewerValidationComponent;
  let fixture: ComponentFixture<InterviewerValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewerValidationComponent]
    });
    fixture = TestBed.createComponent(InterviewerValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
