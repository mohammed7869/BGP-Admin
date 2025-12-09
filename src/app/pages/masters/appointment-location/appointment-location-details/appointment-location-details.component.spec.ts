import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentLocationDetailsComponent } from './appointment-location-details.component';

describe('AppointmentLocationDetailsComponent', () => {
  let component: AppointmentLocationDetailsComponent;
  let fixture: ComponentFixture<AppointmentLocationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentLocationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentLocationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
