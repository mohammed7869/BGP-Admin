import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentNewComponent } from './appointment-new.component';

describe('AppointmentNewComponent', () => {
  let component: AppointmentNewComponent;
  let fixture: ComponentFixture<AppointmentNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
