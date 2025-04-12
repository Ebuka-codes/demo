import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateFilterModalComponent } from './candidate-filter-modal.component';

describe('CandidateFilterComponent', () => {
  let component: CandidateFilterModalComponent;
  let fixture: ComponentFixture<CandidateFilterModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateFilterModalComponent],
    });
    fixture = TestBed.createComponent(CandidateFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
