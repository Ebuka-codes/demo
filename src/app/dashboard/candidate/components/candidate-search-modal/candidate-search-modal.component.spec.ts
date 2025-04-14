import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSearchModalComponent } from './candidate-search-modal.component';

describe('CandidateSearchModalComponent', () => {
  let component: CandidateSearchModalComponent;
  let fixture: ComponentFixture<CandidateSearchModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateSearchModalComponent]
    });
    fixture = TestBed.createComponent(CandidateSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
