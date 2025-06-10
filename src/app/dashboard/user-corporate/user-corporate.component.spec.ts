import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCorporateComponent } from './user-corporate.component';

describe('UserCorporateComponent', () => {
  let component: UserCorporateComponent;
  let fixture: ComponentFixture<UserCorporateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCorporateComponent]
    });
    fixture = TestBed.createComponent(UserCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
