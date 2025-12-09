// ...existing code...
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/providers/services/appointment.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-appointment-new',
  templateUrl: './appointment-new.component.html',
  styleUrls: ['./appointment-new.component.scss']
})
export class AppointmentNewComponent implements OnInit {
  customTimeSlot: string = '';
  bookingForm!: FormGroup;
  patientTypes = ['New', 'Returning'];
  sexOptions = ['Male', 'Female', 'Other'];
  insuranceProviders = ['Aetna', 'Cigna', 'UnitedHealthcare', 'None'];
  calendarLocations = ['Downtown Newark', 'East Orange', 'Westfield'];
  availableTimes = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private toastrMessageService: ToastrMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      patientType: ['New', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      sex: ['', Validators.required],
      reasonForVisit: [''],
      insuranceProvider: ['None'],
      memberId: [''],
      groupNumber: [''],
      insurancePhone: [''],
      calendarLocation: [this.calendarLocations[0]],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      customTime: [''],
    });
  }

  setCustomTimeSlot() {
    if (this.customTimeSlot) {
      this.bookingForm.patchValue({ customTime: this.customTimeSlot });
    }
  }
  
  get selectedTime(): string {
    return this.bookingForm.value.customTime || this.bookingForm.value.appointmentTime;
  }

  onSubmit() {
    if (this.bookingForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.bookingForm.value;
      
      // Prepare the booking request
      const bookingRequest: any = {
        reasonForVisit: formValue.reasonForVisit || '',
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        dateOfBirth: new Date(formValue.dob).toISOString(),
        gender: formValue.sex,
        isNewClient: formValue.patientType === 'New',
        hasInsurance: formValue.insuranceProvider !== 'None',
        insuranceId: this.getInsuranceId(formValue.insuranceProvider),
        memberId: formValue.memberId || '',
        groupNumber: formValue.groupNumber || '',
        appointmentDateTime: this.combineDateTime(formValue.appointmentDate, this.selectedTime),
        locationId: this.getLocationId(formValue.calendarLocation),
        dayOfWeek: new Date(formValue.appointmentDate).getDay(),
        startTime: {
          ticks: this.convertTimeToTicks(this.selectedTime)
        },
        endTime: {
          ticks: this.convertTimeToTicks(this.selectedTime) + (30 * 600000000) // Default 30-minute appointment
        },
        appStatus: 1 // Set initial status as "Pending Request"
      };

      // Call the booking API
      this.appointmentService.create(bookingRequest).subscribe({
        next: (response) => {
          this.toastrMessageService.showSuccess('Appointment request submitted successfully! Status: Pending Request', 'Success');
          this.router.navigate(['/appointments']);
        },
        error: (error) => {
          console.error('Error booking appointment:', error);
          this.toastrMessageService.showError('Error booking appointment. Please try again.', 'Error');
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.toastrMessageService.showWarning('Please fill in all required fields.', 'Warning');
    }
  }

  // Helper methods
  private combineDateTime(date: string, time: string): string {
    const appointmentDate = new Date(date);
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }
    
    appointmentDate.setHours(hour24, minutes, 0, 0);
    return appointmentDate.toISOString();
  }

  private convertTimeToTicks(timeString: string): number {
    const [timePart, period] = timeString.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    const isPM = period === 'PM';
    const hour24 = isPM && hours !== 12 ? hours + 12 : (!isPM && hours === 12 ? 0 : hours);
    
    // Convert to .NET ticks (100 nanoseconds since 1/1/0001)
    return (hour24 * 36000000000) + (minutes * 600000000);
  }

  private getInsuranceId(insuranceProvider: string): number {
    // Map insurance provider names to IDs
    const insuranceMap: { [key: string]: number } = {
      'Aetna': 1,
      'Cigna': 2,
      'UnitedHealthcare': 3,
      'None': 0
    };
    return insuranceMap[insuranceProvider] || 0;
  }

  private getLocationId(location: string): number {
    // Map location names to IDs
    const locationMap: { [key: string]: number } = {
      'Downtown Newark': 1,
      'East Orange': 2,
      'Westfield': 3
    };
    return locationMap[location] || 1;
  }
}
