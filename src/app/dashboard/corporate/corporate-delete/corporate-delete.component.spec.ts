import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateDeleteComponent } from './corporate-delete.component';

describe('CorporateDeleteComponent', () => {
  let component: CorporateDeleteComponent;
  let fixture: ComponentFixture<CorporateDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateDeleteComponent]
    });
    fixture = TestBed.createComponent(CorporateDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
