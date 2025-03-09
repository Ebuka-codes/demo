import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateEditComponent } from './corporate-edit.component';

describe('CorporateEditComponent', () => {
  let component: CorporateEditComponent;
  let fixture: ComponentFixture<CorporateEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateEditComponent]
    });
    fixture = TestBed.createComponent(CorporateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
