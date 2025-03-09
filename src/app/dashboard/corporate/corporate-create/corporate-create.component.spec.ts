import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateCreateComponent } from './corporate-create.component';

describe('CorporateCreateComponent', () => {
  let component: CorporateCreateComponent;
  let fixture: ComponentFixture<CorporateCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateCreateComponent]
    });
    fixture = TestBed.createComponent(CorporateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
