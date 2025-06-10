import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobViewComponent } from './job-view.component';

describe('JobViewComponent', () => {
  let component: JobViewComponent;
  let fixture: ComponentFixture<JobViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobViewComponent]
    });
    fixture = TestBed.createComponent(JobViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
