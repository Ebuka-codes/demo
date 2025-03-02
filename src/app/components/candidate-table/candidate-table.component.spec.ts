import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateTableComponent } from './candidate-table.component';

describe('CandidateTableComponent', () => {
  let component: CandidateTableComponent;
  let fixture: ComponentFixture<CandidateTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateTableComponent]
    });
    fixture = TestBed.createComponent(CandidateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
