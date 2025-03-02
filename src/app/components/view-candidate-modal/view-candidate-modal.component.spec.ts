import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidateModalComponent } from './view-candidate-modal.component';

describe('ViewCandidateModalComponent', () => {
  let component: ViewCandidateModalComponent;
  let fixture: ComponentFixture<ViewCandidateModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCandidateModalComponent]
    });
    fixture = TestBed.createComponent(ViewCandidateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
