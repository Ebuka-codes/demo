import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateListComponent } from './corporate-list.component';

describe('CorporateListComponent', () => {
  let component: CorporateListComponent;
  let fixture: ComponentFixture<CorporateListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateListComponent]
    });
    fixture = TestBed.createComponent(CorporateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
