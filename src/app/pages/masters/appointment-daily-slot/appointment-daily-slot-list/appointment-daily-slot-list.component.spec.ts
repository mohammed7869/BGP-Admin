import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDailySlotListComponent } from './appointment-daily-slot-list.component';

describe('AppointmentDailySlotListComponent', () => {
  let component: AppointmentDailySlotListComponent;
  let fixture: ComponentFixture<AppointmentDailySlotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentDailySlotListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentDailySlotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
