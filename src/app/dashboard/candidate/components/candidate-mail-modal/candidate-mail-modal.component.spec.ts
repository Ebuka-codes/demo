import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateMailModalComponent } from './candidate-mail-modal.component';

describe('CandidateMailModalComponent', () => {
  let component: CandidateMailModalComponent;
  let fixture: ComponentFixture<CandidateMailModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateMailModalComponent]
    });
    fixture = TestBed.createComponent(CandidateMailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
