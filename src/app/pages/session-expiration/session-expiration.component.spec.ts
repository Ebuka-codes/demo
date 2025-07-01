import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpirationComponent } from './session-expiration.component';

describe('SessionExpirationComponent', () => {
  let component: SessionExpirationComponent;
  let fixture: ComponentFixture<SessionExpirationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionExpirationComponent],
    });
    fixture = TestBed.createComponent(SessionExpirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
