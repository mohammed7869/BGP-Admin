import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentLocationListComponent } from './appointment-location-list.component';

describe('AppointmentLocationListComponent', () => {
  let component: AppointmentLocationListComponent;
  let fixture: ComponentFixture<AppointmentLocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentLocationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
