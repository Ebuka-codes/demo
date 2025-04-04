import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePasswordComponent } from './create-password.component';

describe('CreatePasswordComponent', () => {
  let component: CreatePasswordComponent;
  let fixture: ComponentFixture<CreatePasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePasswordComponent]
    });
    fixture = TestBed.createComponent(CreatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
