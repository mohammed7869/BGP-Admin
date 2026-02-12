import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../providers/services/appointment.service';
import { InsuranceService } from '../../../providers/services/insurance.service';
import { RescheduleModalComponent } from '../../../shared/reschedule-modal/reschedule-modal.component';
import { CancelAppointmentModalComponent } from '../../../shared/cancel-appointment-modal/cancel-appointment-modal.component';
import { ArchiveAppointmentModalComponent } from '../../../shared/archive-appointment-modal/archive-appointment-modal.component';
import { BookAppointmentModalComponent } from '../../../shared/book-appointment-modal/book-appointment-modal.component';
import { appCommon } from '../../../common/_appCommon';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { CountryISO, SearchCountryField, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {

  // Inline editing states
  editingField: string | null = null;
  editValue: string = '';
  saving = false;

  // Phone editing state
  editingPhone: boolean = false;
  phoneValue: any = null;
  separateDialCode = true;
  preferredCountries: string[] = ['us', 'ca', 'gb'];

  // ngx-intl-tel-input enums
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  // Separate editing states for first and last name
  editingFirstName: boolean = false;
  editingLastName: boolean = false;
  firstNameValue: string = '';
  lastNameValue: string = '';

  // Notes editing state
  editingNotes: boolean = false;
  notesValue: string = '';

  // Insurance editing state
  editingInsurance: boolean = false;
  selectedInsuranceId: any | null = null;
  insuranceList: any[] = [];

  recordData: any;
  public appCommon = appCommon;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private insuranceService: InsuranceService,
    private modalService: NgbModal,
    private toastrMessageService: ToastrMessageService,
    private recordCreationService: RecordCreationService
  ) {
    if (this.route.snapshot.data['recordData']) {
      this.recordData = this.route.snapshot.data['recordData'];
    }
  }

  ngOnInit(): void {
    this.loadInsuranceList();
  }

  // Load insurance list
  loadInsuranceList(): void {
    this.insuranceService.getAllInsurance().subscribe({
      next: (data) => {
        this.insuranceList = data;
      },
      error: (err) => {
        console.error('Error loading insurance list:', err);
        this.toastrMessageService.showError("Failed to load insurance list.", "Error");
      }
    });
  }

  // Start editing insurance
  startEditInsurance(): void {
    this.editingInsurance = true;
    this.selectedInsuranceId = this.recordData.insuranceId;
  }

  // Save insurance information
  saveInsuranceEdit(): void {
    if (!this.recordData.id) return;

    this.saving = true;

    // Determine the correct insurance ID
    let insuranceId = 0;

    // If we're editing from the insurance dropdown
    if (this.editingInsurance && this.selectedInsuranceId) {
      insuranceId = parseInt(this.selectedInsuranceId);
    } else {
      // For member ID or group number edits, preserve existing insurance
      if (this.recordData.insuranceId) {
        insuranceId = parseInt(this.recordData.insuranceId);
      } else if (this.recordData.insuranceName && this.insuranceList.length > 0) {
        // Try to find insurance ID based on name if ID is null
        const matchingInsurance = this.insuranceList.find(ins =>
          ins.name && ins.name.toLowerCase() === this.recordData.insuranceName.toLowerCase()
        );
        if (matchingInsurance) {
          insuranceId = matchingInsurance.id;
          // Update the local record with the found ID
          this.recordData.insuranceId = matchingInsurance.id;
          this.recordData.insuranceName = matchingInsurance.name;
        }
      }
    }

    // Prepare update data based on what's being edited
    let updateData: any = {
      id: this.recordData.id,
      insuranceId: insuranceId,
      memberId: this.recordData.memberId || "",
      groupNumber: this.recordData.groupNumber || ""
    };

    // If we're editing member ID or group number
    if (this.editingField === 'memberId') {
      updateData.memberId = this.editValue;
    } else if (this.editingField === 'groupNumber') {
      updateData.groupNumber = this.editValue;
    }

    this.insuranceService.updateInsuranceInfo(updateData).subscribe({
      next: () => {
        // Update the local appointment object
        if (this.editingInsurance && this.selectedInsuranceId) {
          const selectedInsurance = this.insuranceList.find(ins => ins.id == this.selectedInsuranceId);
          this.recordData.insuranceId = this.selectedInsuranceId;
          this.recordData.insuranceName = selectedInsurance ? selectedInsurance.name : '';
          this.editingInsurance = false;
          this.selectedInsuranceId = null;
        } else {
          // For member ID or group number edits, ensure insurance name is preserved
          if (updateData.insuranceId > 0 && !this.recordData.insuranceName) {
            const matchingInsurance = this.insuranceList.find(ins => ins.id === updateData.insuranceId);
            if (matchingInsurance) {
              this.recordData.insuranceName = matchingInsurance.name;
            }
          }
        }

        if (this.editingField === 'memberId') {
          this.recordData.memberId = this.editValue;
          this.editingField = null;
          this.editValue = '';
        } else if (this.editingField === 'groupNumber') {
          this.recordData.groupNumber = this.editValue;
          this.editingField = null;
          this.editValue = '';
        }

        this.saving = false;
        this.toastrMessageService.showSuccess("Insurance information updated successfully.", "Success");
      },
      error: (err) => {
        console.error('Error updating insurance:', err);
        this.saving = false;
        this.toastrMessageService.showError("Failed to update insurance information. Please try again.", "Error");
      }
    });
  }

  // Delete insurance information
  deleteInsuranceInfo(): void {
    if (!this.recordData.id) return;

    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete the insurance information?\n\n' +
      'This action will:\n' +
      '• Remove the insurance provider\n' +
      '• Clear the Member ID\n' +
      '• Clear the Group Number\n\n' +
      'This action cannot be undone.'
    );
    
    if (!confirmed) {
      return;
    }

    this.saving = true;

    this.insuranceService.deleteInsuranceInfo(this.recordData.id).subscribe({
      next: () => {
        // Clear insurance data locally
        this.recordData.insuranceId = null;
        this.recordData.insuranceName = null;
        this.recordData.memberId = '';
        this.recordData.groupNumber = '';
        
        // Reset any editing states
        this.editingInsurance = false;
        this.selectedInsuranceId = null;
        this.editingField = null;
        this.editValue = '';

        this.saving = false;
        this.toastrMessageService.showSuccess("Insurance information deleted successfully.", "Success");
      },
      error: (err) => {
        console.error('Error deleting insurance information:', err);
        this.saving = false;
        this.toastrMessageService.showError("Failed to delete insurance information. Please try again.", "Error");
      }
    });
  }

  // Generate Google Calendar URL for an appointment
  generateGoogleCalendarUrl(appointment: any): string {
    // Extract date from appointmentDateTime and handle timezone issues
    let dateOnly: string;

    if (appointment.appointmentDateTime) {
      // Extract just the date part to avoid timezone conversion issues
      const dateStr = appointment.appointmentDateTime.split('T')[0]; // Get YYYY-MM-DD directly
      dateOnly = dateStr;
    } else {
      // Fallback to current date
      dateOnly = new Date().toISOString().split('T')[0];
    }

    // Create start date by combining appointment date with startTime
    let startDate: Date;
    let endDate: Date;

    if (appointment.startTime && appointment.endTime) {
      // Parse startTime (format: "09:30:00")
      const [startHours, startMinutes, startSeconds] = appointment.startTime.split(':').map(Number);
      startDate = new Date(dateOnly + 'T00:00:00'); // Local time, no Z suffix
      startDate.setHours(startHours, startMinutes, startSeconds || 0);

      // Parse endTime (format: "10:00:00")
      const [endHours, endMinutes, endSecondsEnd] = appointment.endTime.split(':').map(Number);
      endDate = new Date(dateOnly + 'T00:00:00'); // Local time, no Z suffix
      endDate.setHours(endHours, endMinutes, endSecondsEnd || 0);
    } else {
      // Fallback to appointmentDateTime if startTime/endTime not available
      startDate = new Date(appointment.appointmentDateTime);
      endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1); // Default 1 hour duration
    }

    // Format dates for Google Calendar URL
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    // Create patient name from firstName and lastName
    const patientName = `${appointment.firstName} ${appointment.lastName}`.trim();

    // Create location string from address components
    const locationString = `${appointment.address}, ${appointment.city}, ${appointment.state} ${appointment.zipCode}`.trim();

    // Create event details
    const eventTitle = encodeURIComponent(`Dental Appointment - ${patientName}`);
    const eventDetails = encodeURIComponent(
      `Patient: ${patientName}\n` +
      `Email: ${appointment.email}\n` +
      `Phone: ${appointment.phone}\n` +
      `Location: ${appointment.locationName}\n` +
      `Address: ${appointment.address}, ${appointment.city}, ${appointment.state} ${appointment.zipCode}\n` +
      (appointment.reasonForVisit ? `Reason: ${appointment.reasonForVisit}\n` : '') +
      (appointment.hasInsurance && appointment.insuranceName ? `Insurance: ${appointment.insuranceName}\n` : '') +
      `\nPlease arrive 10 minutes before your scheduled appointment time.`
    );

    const startDateTime = formatDate(startDate);
    const endDateTime = formatDate(endDate);

    // Generate Google Calendar URL
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDateTime}/${endDateTime}&details=${eventDetails}&location=${encodeURIComponent(locationString)}&sf=true&output=xml`;

    return calendarUrl;
  }

  // Handle adding appointment to Google Calendar
  addToGoogleCalendar(appointment: any): void {
    const calendarUrl = this.generateGoogleCalendarUrl(appointment);
    window.open(calendarUrl, '_blank');
  }

  // Inline editing methods
  startEdit(field: string, value: string): void {
    // Validate that insurance is present before allowing member ID or group number editing
    if ((field === 'memberId' || field === 'groupNumber') && 
        (!this.recordData.insuranceName || this.recordData.insuranceName === 'Not Available')) {
      this.toastrMessageService.showWarning("Please add insurance information first before editing Member ID or Group Number.", "Insurance Required");
      return;
    }
    
    this.editingField = field;
    this.editValue = value;
  }

  // Separate methods for first and last name editing
  startEditFirstName(value: string): void {
    this.editingFirstName = true;
    this.firstNameValue = value;
  }

  startEditLastName(value: string): void {
    this.editingLastName = true;
    this.lastNameValue = value;
  }

  cancelEdit(): void {
    this.editingField = null;
    this.editValue = '';
    this.editingFirstName = false;
    this.editingLastName = false;
    this.firstNameValue = '';
    this.lastNameValue = '';
    this.editingNotes = false;
    this.notesValue = '';
    this.editingInsurance = false;
    this.selectedInsuranceId = null;
    this.editingPhone = false;
    this.phoneValue = null;
  }

  // Start editing phone
  startEditPhone(value: string): void {
    this.editingPhone = true;
    // Parse the existing phone number if available
    if (value) {
      // You might need to parse the existing phone number format
      this.phoneValue = value;
    }
  }

  // Save phone edit
  savePhoneEdit(appointment: any): void {
    if (!appointment.id || !this.phoneValue) return;

    this.saving = true;

    // Get the formatted phone number from the component
    const phoneNumber = this.phoneValue.internationalNumber || this.phoneValue.nationalNumber || this.phoneValue;

    const contactUpdateData = {
      id: appointment.id,
      firstName: appointment.firstName || '',
      lastName: appointment.lastName || '',
      email: appointment.email || '',
      phone: phoneNumber,
      dateOfBirth: appointment.dateOfBirth || '',
      gender: appointment.gender || '',
      isNewClient: appointment.isNewClient || false
    };

    this.appointmentService.updateContact(contactUpdateData).subscribe({
      next: () => {
        // Update the local appointment object
        appointment.phone = phoneNumber;
        this.editingPhone = false;
        this.phoneValue = null;
        this.saving = false;

        // Show success notification
        this.toastrMessageService.showSuccess("Phone number updated successfully.", "Success");
      },
      error: (err) => {
        console.error('Error updating phone number:', err);
        this.saving = false;
        this.toastrMessageService.showError("Failed to update phone number. Please try again.", "Error");
      }
    });
  }

  // Start editing notes
  startEditNotes(value: string): void {
    this.editingNotes = true;
    this.notesValue = value;
  }

  // Save notes
  saveNotesEdit(appointment: any): void {
    if (!appointment.id) return;

    this.saving = true;
    const updateData = {
      id: appointment.id,
      note: this.notesValue
    };

    this.appointmentService.updateNote(updateData).subscribe({
      next: () => {
        // Update the local appointment object
        appointment.note = this.notesValue;
        this.editingNotes = false;
        this.notesValue = '';
        this.saving = false;

        // Show success notification for 3 seconds
        this.toastrMessageService.showSuccess("Notes updated successfully.", "Success");
      },
      error: (err) => {
        console.error('Error updating notes:', err);
        this.saving = false;
        this.toastrMessageService.showError("Failed to update notes. Please try again.", "Error");
      }
    });
  }

  saveEdit(appointment: any): void {
    if (!appointment.id || !this.editingField) return;

    this.saving = true;

    // Prepare contact update data based on the field being edited
    const contactUpdateData = {
      id: appointment.id,
      firstName: appointment.firstName || '',
      lastName: appointment.lastName || '',
      email: appointment.email || '',
      phone: appointment.phone || '',
      dateOfBirth: appointment.dateOfBirth || '',
      gender: appointment.gender || '',
      isNewClient: appointment.isNewClient || false
    };

    // Update the specific field being edited
    switch (this.editingField) {
      case 'phone':
        contactUpdateData.phone = this.editValue;
        break;
      case 'email':
        contactUpdateData.email = this.editValue;
        break;
      case 'dob':
        contactUpdateData.dateOfBirth = this.editValue;
        break;
      case 'gender':
        contactUpdateData.gender = this.editValue;
        break;
      default:
        // For other fields, use the existing updateFields method
        let updateData: any = {};
        if (this.editingField == 'insuranceProvider' || this.editingField == 'memberId' ||
          this.editingField == 'groupNumber' || this.editingField == 'insurancePhone') {
          const insuranceInfo: any = { ...appointment.insuranceInfo };

          switch (this.editingField) {
            case 'insuranceProvider':
              insuranceInfo.provider = this.editValue;
              break;
            case 'memberId':
              insuranceInfo.memberId = this.editValue;
              break;
            case 'groupNumber':
              insuranceInfo.groupNumber = this.editValue;
              break;
            case 'insurancePhone':
              insuranceInfo.phoneNumber = this.editValue;
              break;
          }
          updateData = { insuranceInfo };
        } else {
          updateData = { [this.editingField]: this.editValue };
        }

        this.appointmentService.updateFields(appointment.id).subscribe({
          next: () => {
            if (updateData.insuranceInfo) {
              appointment.insuranceInfo = { ...appointment.insuranceInfo, ...updateData.insuranceInfo };
            } else {
              Object.assign(appointment, updateData);
            }
            this.editingField = null;
            this.editValue = '';
            this.saving = false;
          },
          error: (err) => {
            console.error('Error updating appointment:', err);
            this.saving = false;
            this.toastrMessageService.showError("Failed to save changes. Please try again.", "Error");
          }
        });
        return;
    }

    // Use the new contact update API for patient information fields
    this.appointmentService.updateContact(contactUpdateData).subscribe({
      next: () => {
        // Update the local appointment object
        Object.assign(appointment, contactUpdateData);
        this.editingField = null;
        this.editValue = '';
        this.saving = false;

        // Show success notification
        this.toastrMessageService.showSuccess("Patient information updated successfully.", "Success");

        // Refresh the page to fetch updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error: (err) => {
        console.error('Error updating patient information:', err);
        this.saving = false;
        this.toastrMessageService.showError("Failed to update patient information. Please try again.", "Error");
      }
    });
  }

  // Save first and last name separately
  saveNameEdit(appointment: any, isFirstName: boolean): void {
    if (!appointment.id) return;

    this.saving = true;

    // Prepare contact update data
    const contactUpdateData = {
      id: appointment.id,
      firstName: appointment.firstName || '',
      lastName: appointment.lastName || '',
      email: appointment.email || '',
      phone: appointment.phone || '',
      dateOfBirth: appointment.dateOfBirth || '',
      gender: appointment.gender || '',
      isNewClient: appointment.isNewClient || false
    };

    // Update the specific name field being edited
    if (isFirstName) {
      contactUpdateData.firstName = this.firstNameValue;
    } else {
      contactUpdateData.lastName = this.lastNameValue;
    }

    this.appointmentService.updateContact(contactUpdateData).subscribe({
      next: () => {
        // Update the local appointment object
        Object.assign(appointment, contactUpdateData);
        this.editingFirstName = false;
        this.editingLastName = false;
        this.firstNameValue = '';
        this.lastNameValue = '';
        this.saving = false;

        // Show success notification
        this.toastrMessageService.showSuccess("Patient name updated successfully.", "Success");

        // Refresh the page to fetch updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error: (err) => {
        console.error('Error updating patient name:', err);
        this.saving = false;
        this.toastrMessageService.showError("Failed to update patient name. Please try again.", "Error");
      }
    });
  }

  // Helper methods for formatting
  formatDate(date: Date | string): string {
    if (!date) return 'Not Available';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }



  // Map status to display label using predefined statuses
  getStatusDisplayLabel(status: string | undefined): string {
    if (!status) return 'Booked';

    switch (status) {
      case 'Booked':
        return appCommon.EnAppointmentStatusObj["1"]; // "Pending Request"
      case 'Rescheduled':
        return appCommon.EnAppointmentStatusObj["2"]; // "Booked"
      case 'Cancelled':
        return appCommon.EnAppointmentStatusObj["3"]; // "Rescheduled"
              case 'Archived':
          return appCommon.EnAppointmentStatusObj["5"]; // "Archived"
        default:
          return status;
    }
  }

  // Get status badge class using predefined statuses
  getStatusBadgeClass(status: any): string {
    if (!status) return 'bg-secondary';
    switch (status) {
      case 1:
        return 'bg-info'; // Pending Request
      case 2:
        return 'bg-success'; // Booked
      case 3:
        return 'bg-warning'; // Rescheduled
      case 4:
        return 'bg-danger'; // Cancelled
      case 5:
        return 'bg-dark'; // Archived
      default:
        return 'bg-secondary';
    }
  }

  // Get status icon class for enhanced UI
  getStatusIconClass(status: any): string {
    if (!status) return 'fa fa-question-circle';
    switch (status) {
      case 1:
        return 'fa fa-clock'; // Pending Request
      case 2:
        return 'fa fa-check-circle'; // Booked
      case 3:
        return 'fa fa-sync-alt'; // Rescheduled
      case 4:
        return 'fa fa-times-circle'; // Cancelled
      case 5:
        return 'fa fa-archive'; // Archived
      default:
        return 'fa fa-question-circle';
    }
  }

  updateStatusFromObservable(status: any): void {
    if (status == 'Rescheduled') {
      this.openRescheduleModal(this.recordData);
    } else if (status == 'Cancelled') {
      this.openCancelModal(this.recordData);
    } else if (status == 'Archived') {
      this.openArchiveModal(this.recordData);
    } else {
      //this.updateStatus(appointment, status);
    }
  }

  openRescheduleModal(appointment: any): void {
    const modalRef = this.modalService.open(RescheduleModalComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      scrollable: true,
    });

    modalRef.componentInstance.appointment = appointment;

    modalRef.result.then((rescheduleData) => {
      if (rescheduleData) {
        // Update the appointment details in the current view
        this.updateAppointmentData(rescheduleData);

        // Update appointment status to Rescheduled
        this.recordData.appStatus = 3; // Rescheduled status ID from EnAppointmentStatus

        // Announce the update to other components
        this.recordCreationService.announceUpdate({
          table: 'Appointment',
          id: this.recordData.id,
          updatedData: this.recordData,
          action: 'reschedule'
        });
      }
    }).catch(() => {
      // Modal was dismissed
    });
  }

  updateAppointmentData(rescheduleData: any): void {
    // Update the appointment data with new reschedule information
    if (rescheduleData && rescheduleData.newAppointment) {
      const newAppointment = rescheduleData.newAppointment;

      // Update appointment date and time
      this.recordData.appointmentDateTime = newAppointment.appointmentDate + 'T' +
        this.convertTimeToISO(newAppointment.appointmentTime);
      this.recordData.appointmentDate = newAppointment.appointmentDate;
      this.recordData.appointmentTime = newAppointment.appointmentTime;
      this.recordData.startTime = newAppointment.appointmentTime;

      // Update end time if provided
      if (newAppointment.endTime) {
        this.recordData.endTime = newAppointment.endTime;
      }

      // Update location information
      this.recordData.locationId = newAppointment.locationId;
      this.recordData.locationName = newAppointment.location;

      // Update provider
      this.recordData.provider = newAppointment.provider;

      // Update reason
      this.recordData.reasonForVisit = newAppointment.reasonForVisit;

      // Update appointment status to Rescheduled
      this.recordData.appStatus = 3;

      console.log('Updated appointment data:', this.recordData);
    }
  }

  // Helper method to convert time to ISO format
  private convertTimeToISO(timeString: string): string {
    const [timePart, period] = timeString.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);

    let hour24 = hours;
    if (period == 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period == 'AM' && hours == 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }

  openCancelModal(appointment: any): void {
    const modalRef = this.modalService.open(CancelAppointmentModalComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      scrollable: true,
    });

    modalRef.componentInstance.appointment = appointment;

    modalRef.result.then((result) => {
      if (result && result.action == 'cancelAppointment') {
        this.appointmentService.cancel(appointment.id)
          .subscribe(
            data => {
              //this.submitLoading = false;
              this.toastrMessageService.showSuccess("Appointment cancelled successfully.", "Success");

              // Update the appointment status in the current view
              this.recordData.appStatus = 4; // Cancelled status ID from EnAppointmentStatus
              this.recordData.status = 'Cancelled';

              // Announce the update to other components
              this.recordCreationService.announceUpdate({
                table: 'Appointment',
                id: this.recordData.id,
                updatedData: this.recordData,
                action: 'cancel'
              });
            },
            error => {
              //this.submitLoading = false;
              this.toastrMessageService.showError(error, "Error");
            }
          )
      }
    }).catch(() => {
      // Modal was dismissed
    });
  }

  openArchiveModal(appointment: any): void {
    const modalRef = this.modalService.open(ArchiveAppointmentModalComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      scrollable: true,
    });

    modalRef.componentInstance.appointment = appointment;

    modalRef.result.then((result) => {
      if (result && result.action == 'archiveAppointment') {
        this.appointmentService.archive(appointment.id)
          .subscribe(
            data => {
              this.toastrMessageService.showSuccess("Appointment archived successfully.", "Success");

              // Update the appointment status in the current view
              this.recordData.appStatus = 5; // Archived status ID from EnAppointmentStatus
              this.recordData.status = 'Archived';

              // Announce the update to other components
              this.recordCreationService.announceUpdate({
                table: 'Appointment',
                id: this.recordData.id,
                updatedData: this.recordData,
                action: 'archive'
              });
            },
            error => {
              this.toastrMessageService.showError(error, "Error");
            }
          )
      }
    }).catch(() => {
      // Modal was dismissed
    });
  }

  openBookAppointmentModal(appointment: any): void {
    const modalRef = this.modalService.open(BookAppointmentModalComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      scrollable: true,
    });

    modalRef.componentInstance.appointmentData = appointment;

    modalRef.result.then((result) => {
      if (result === 'confirmed') {
        this.toastrMessageService.showSuccess("Appointment confirmed successfully.", "Success");

        // Update the appointment status in the current view
        this.recordData.appStatus = 2; // Booked status ID from EnAppointmentStatus
        this.recordData.status = 'Booked';

        // Announce the update to other components
        this.recordCreationService.announceUpdate({
          table: 'Appointment',
          id: this.recordData.id,
          updatedData: this.recordData,
          action: 'confirm'
        });
      }
    }).catch(() => {
      // Modal was dismissed
    });
  }

  showSuccessMessage(messageData: any): void {
    // Create a success alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; min-width: 400px;';
    alertDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="flex-shrink-0">
          <i class="fa fa-check-circle text-success mr-2"></i>
        </div>
        <div class="flex-grow-1">
          <strong class="text-dark">${messageData.title}</strong>
          <p class="mb-0 text-dark">${messageData.message}</p>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    // Add to the document
    document.body.appendChild(alertDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 5000);

    // Handle close button
    const closeBtn = alertDiv.querySelector('.btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (alertDiv.parentNode) {
          alertDiv.parentNode.removeChild(alertDiv);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/appointments']);
  }
}
