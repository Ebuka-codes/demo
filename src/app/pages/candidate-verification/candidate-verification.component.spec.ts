import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateVerificationComponent } from './candidate-verification.component';

describe('CandidateVerificationComponent', () => {
  let component: CandidateVerificationComponent;
  let fixture: ComponentFixture<CandidateVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateVerificationComponent]
    });
    fixture = TestBed.createComponent(CandidateVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
