import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInsuranceDetailsComponent } from './general-insurance-details.component';

describe('GeneralInsuranceDetailsComponent', () => {
  let component: GeneralInsuranceDetailsComponent;
  let fixture: ComponentFixture<GeneralInsuranceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralInsuranceDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralInsuranceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
