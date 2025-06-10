import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateRejectComponent } from './candidate-reject.component';

describe('CandidateRejectComponent', () => {
  let component: CandidateRejectComponent;
  let fixture: ComponentFixture<CandidateRejectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateRejectComponent]
    });
    fixture = TestBed.createComponent(CandidateRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
