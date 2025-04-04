import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullPageLoaderSpinnerComponent } from './full-page-loader-spinner.component';

describe('FullPageLoaderSpinnerComponent', () => {
  let component: FullPageLoaderSpinnerComponent;
  let fixture: ComponentFixture<FullPageLoaderSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FullPageLoaderSpinnerComponent]
    });
    fixture = TestBed.createComponent(FullPageLoaderSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
