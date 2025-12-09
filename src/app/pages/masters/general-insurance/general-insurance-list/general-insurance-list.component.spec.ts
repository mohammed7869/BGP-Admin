import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInsuranceListComponent } from './general-insurance-list.component';

describe('GeneralInsuranceListComponent', () => {
  let component: GeneralInsuranceListComponent;
  let fixture: ComponentFixture<GeneralInsuranceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralInsuranceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralInsuranceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
