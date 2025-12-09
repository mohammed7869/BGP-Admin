import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cancel-appointment-modal',
  templateUrl: './cancel-appointment-modal.component.html',
  styleUrls: ['./cancel-appointment-modal.component.scss']
})
export class CancelAppointmentModalComponent implements OnInit {

  @Input() appointment: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  confirmCancel(): void {
    // Show confirmation dialog before proceeding with cancellation
    const patientName = `${this.appointment?.firstName} ${this.appointment?.lastName}` || 'Patient';
    const appointmentDate = this.appointment?.appointmentDateTime ? 
      new Date(this.appointment.appointmentDateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Unknown Date';
    
    const appointmentTime = this.appointment?.startTime || this.appointment?.appointmentTime || 'Unknown Time';
    const locationName = this.appointment?.locationName || 'Unknown Location';

    const confirmationMessage = `Are you sure you want to cancel this appointment?\n\n` +
      `Patient: ${patientName}\n` +
      `Date: ${appointmentDate}\n` +
      `Time: ${appointmentTime}\n` +
      `Location: ${locationName}`;

    if (confirm(confirmationMessage)) {
      // User confirmed, proceed with cancellation
      this.activeModal.close({ action: 'cancelAppointment', appointment: this.appointment });
    }
    // If user cancels, do nothing (modal stays open)
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
} 