import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDailySlotDetailsComponent } from './appointment-daily-slot-details.component';

describe('AppointmentDailySlotDetailsComponent', () => {
  let component: AppointmentDailySlotDetailsComponent;
  let fixture: ComponentFixture<AppointmentDailySlotDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentDailySlotDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentDailySlotDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
