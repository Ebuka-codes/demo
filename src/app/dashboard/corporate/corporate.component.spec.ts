import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateComponent } from './corporate.component';

describe('CorporateComponent', () => {
  let component: CorporateComponent;
  let fixture: ComponentFixture<CorporateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateComponent]
    });
    fixture = TestBed.createComponent(CorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
