import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobEditComponent } from './job-edit.component';

describe('JobEditComponent', () => {
  let component: JobEditComponent;
  let fixture: ComponentFixture<JobEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobEditComponent]
    });
    fixture = TestBed.createComponent(JobEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
