import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateScheduleDateComponent } from './candidate-schedule-date.component';

describe('CandidateScheduleDateComponent', () => {
  let component: CandidateScheduleDateComponent;
  let fixture: ComponentFixture<CandidateScheduleDateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateScheduleDateComponent]
    });
    fixture = TestBed.createComponent(CandidateScheduleDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
