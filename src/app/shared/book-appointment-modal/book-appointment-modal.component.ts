import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../providers/services/appointment.service';
import { ToastrMessageService } from '../../providers/services/toastr-message.service';

@Component({
  selector: 'app-book-appointment-modal',
  templateUrl: './book-appointment-modal.component.html',
  styleUrls: ['./book-appointment-modal.component.scss']
})
export class BookAppointmentModalComponent {
  @Input() appointmentData: any;
  isSubmitting = false;

  constructor(
    public activeModal: NgbActiveModal,
    private appointmentService: AppointmentService,
    private toastrMessageService: ToastrMessageService
  ) { }

  confirmBooking(): void {
    if (!this.appointmentData?.id) {
      this.toastrMessageService.showError('Invalid appointment data', 'Error');
      return;
    }

    this.isSubmitting = true;
    
    this.appointmentService.confirmAppointment(this.appointmentData.id).subscribe({
      next: (response) => {
        // Removed duplicate toast message - parent component will handle success feedback
        this.activeModal.close('confirmed');
      },
      error: (error) => {
        console.error('Error confirming appointment:', error);
        this.toastrMessageService.showError('Error confirming appointment. Please try again.', 'Error');
        this.isSubmitting = false;
      }
    });
  }

  closeModal(): void {
    this.activeModal.dismiss('closed');
  }
}
