import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAppointmentModalComponent } from './book-appointment-modal.component';

describe('BookAppointmentModalComponent', () => {
  let component: BookAppointmentModalComponent;
  let fixture: ComponentFixture<BookAppointmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookAppointmentModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookAppointmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
