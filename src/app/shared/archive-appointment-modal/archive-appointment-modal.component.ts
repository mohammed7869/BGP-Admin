import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-archive-appointment-modal',
  templateUrl: './archive-appointment-modal.component.html',
  styleUrls: ['./archive-appointment-modal.component.scss']
})
export class ArchiveAppointmentModalComponent implements OnInit {

  @Input() appointment: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  confirmArchive(): void {
    // Show confirmation dialog before proceeding with archiving
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

    const confirmationMessage = `Are you sure you want to archive this appointment?\n\n` +
      `Patient: ${patientName}\n` +
      `Date: ${appointmentDate}\n` +
      `Time: ${appointmentTime}\n` +
      `Location: ${locationName}\n\n` +
      `Archived appointments can be restored later but will be hidden from the main list.`;

    if (confirm(confirmationMessage)) {
      // User confirmed, proceed with archiving
      this.activeModal.close({ action: 'archiveAppointment', appointment: this.appointment });
    }
    // If user cancels, do nothing (modal stays open)
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
