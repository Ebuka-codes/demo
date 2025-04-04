import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerComponent } from './interviewer.component';

describe('InterviewerComponent', () => {
  let component: InterviewerComponent;
  let fixture: ComponentFixture<InterviewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewerComponent]
    });
    fixture = TestBed.createComponent(InterviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
