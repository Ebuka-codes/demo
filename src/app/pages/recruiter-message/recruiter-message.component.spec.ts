import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterMessageComponent } from './recruiter-message.component';

describe('RecruiterMessageComponent', () => {
  let component: RecruiterMessageComponent;
  let fixture: ComponentFixture<RecruiterMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterMessageComponent]
    });
    fixture = TestBed.createComponent(RecruiterMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
