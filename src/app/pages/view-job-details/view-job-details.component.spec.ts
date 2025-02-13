import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJobDetailsComponent } from './view-job-details.component';

describe('ViewJobDetailsComponent', () => {
  let component: ViewJobDetailsComponent;
  let fixture: ComponentFixture<ViewJobDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewJobDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewJobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
