import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface Appointment {
  id: number;
  reasonForVisit: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  isNewClient: boolean;
  appointmentDateTime: string;
  locationId: number;
  locationName: string;
  startTime: string;
  endTime: string;
  appStatus: number;
  createdDate: string;
  modifiedDate: string;
  createdBy: string | null;
  modifiedBy: string | null;
  bDeleted: boolean;
}

@Component({
  selector: 'app-appointment-details-modal',
  templateUrl: './appointment-details-modal.component.html',
  styleUrls: ['./appointment-details-modal.component.scss']
})
export class AppointmentDetailsModalComponent implements OnInit {
  @Input() appointment: Appointment;

  statusLabels = {
    1: 'Confirmed',
    2: 'Pending',
    3: 'Cancelled',
    4: 'Completed'
  };

  statusColors = {
    1: 'success',
    2: 'warning',
    3: 'danger',
    4: 'info'
  };

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.activeModal.dismiss();
  }

  getStatusLabel(): string {
    return this.statusLabels[this.appointment.appStatus] || 'Unknown';
  }

  getStatusColorClass(): string {
    return this.statusColors[this.appointment.appStatus] || 'secondary';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  getGenderDisplay(): string {
    if (!this.appointment?.gender) return 'Not specified';
    
    switch (this.appointment.gender.toUpperCase()) {
      case 'M':
      case 'MALE': return 'Male';
      case 'F':
      case 'FEMALE': return 'Female';
      case 'O':
      case 'OTHER': return 'Other';
      default: return this.appointment.gender.charAt(0).toUpperCase() + this.appointment.gender.slice(1).toLowerCase();
    }
  }

  calculateAge(): string {
    if (!this.appointment.dateOfBirth || this.appointment.dateOfBirth === '0001-01-01T00:00:00') {
      return 'Not provided';
    }
    
    const birthDate = new Date(this.appointment.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  }
}
