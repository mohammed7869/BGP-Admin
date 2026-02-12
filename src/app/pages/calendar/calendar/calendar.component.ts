import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput, PluginDef } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from 'src/app/providers/services/appointment.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { AppointmentDetailsModalComponent } from '../appointment-details-modal/appointment-details-modal.component';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';

// Interface for appointment data
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
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  // FullCalendar plugins
  calendarPlugins: PluginDef[] = [dayGridPlugin, timeGridPlugin, interactionPlugin];

  // Calendar properties
  header = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  };

  buttonText = {
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day'
  };

  defaultView = 'dayGridMonth';
  editable = false;
  selectable = true;
  selectMirror = true;
  weekends = true;
  eventLimit = true;
  height = 'auto';
  minTime = '07:00:00';
  maxTime = '20:00:00';
  allDaySlot = false;

  appointments: Appointment[] = [];
  events: EventInput[] = [];
  isLoading: boolean = false;

  // Status mapping for better display
  statusColors = {
    1: '#28a745', // Confirmed - Green
    2: '#ffc107', // Pending - Yellow
    3: '#dc3545', // Cancelled - Red
    4: '#17a2b8'  // Completed - Blue
  };

  statusLabels = {
    1: 'Confirmed',
    2: 'Pending',
    3: 'Cancelled',
    4: 'Completed'
  };
  form: FormGroup;
  constructor(
    private appointmentService: AppointmentService,
    private toastrMessageService: ToastrMessageService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createSearchForm();
    console.log('Calendar component initialized');
    console.log('Calendar plugins:', this.calendarPlugins);
    console.log('Header config:', this.header);
    this.loadAppointments();
  }

  createSearchForm(): void {
    this.form = this.fb.group({
      fromDate: [null],
      toDate: [null],
      searchText: [''],
      phone: [''],
      email: [''],
      patientType: [''],
      location: [''],
      appStatus: [0], // Default to 0 (All)
    });
  }

  loadAppointments(): void {
    this.isLoading = true;
    const filterData = this.getDefaultFilters();

    this.appointmentService.list(filterData).subscribe({
      next: (data: Appointment[]) => {
        this.appointments = data;
        this.convertAppointmentsToEvents();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.toastrMessageService.showError('Failed to load appointments', 'Error');
        this.isLoading = false;
      }
    });
  }

  convertAppointmentsToEvents(): void {
    this.events = this.appointments.map(appointment => {
      const appointmentDate = moment(appointment.appointmentDateTime).format('YYYY-MM-DD');
      const startDateTime = moment(`${appointmentDate} ${appointment.startTime}`);
      const endDateTime = moment(`${appointmentDate} ${appointment.endTime}`);

      // If end time is same as start time or invalid, add 30 minutes
      if (!endDateTime.isValid() || endDateTime.isSameOrBefore(startDateTime)) {
        endDateTime.set({
          hour: startDateTime.hour(),
          minute: startDateTime.minute() + 30
        });
      }

      return {
        id: appointment.id.toString(),
        title: `${appointment.firstName} ${appointment.lastName}`,
        start: startDateTime.format('YYYY-MM-DDTHH:mm:ss'),
        end: endDateTime.format('YYYY-MM-DDTHH:mm:ss'),
        backgroundColor: this.statusColors[appointment.appStatus] || '#6c757d',
        borderColor: this.statusColors[appointment.appStatus] || '#6c757d',
        textColor: '#ffffff',
        extendedProps: {
          appointment: appointment,
          patientName: `${appointment.firstName} ${appointment.lastName}`,
          reason: appointment.reasonForVisit,
          phone: appointment.phone,
          email: appointment.email,
          location: appointment.locationName,
          status: this.statusLabels[appointment.appStatus] || 'Unknown',
          isNewClient: appointment.isNewClient
        }
      };
    });

    // Force calendar to refresh
    setTimeout(() => {
      if (this.calendarComponent) {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.refetchEvents();
      }
    }, 100);
  }

  handleEventClick(arg: any): void {
    const appointment = arg.event.extendedProps.appointment;
    this.showAppointmentDetails(appointment);
  }

  handleDateClick(arg: any): void {
    // Handle date click - could be used to create new appointment
    console.log('Date clicked:', arg.dateStr);
  }

  handleEventMouseEnter(arg: any): void {
    // Show tooltip or highlight
    const props = arg.event.extendedProps;
    arg.el.title = `Patient: ${props.patientName}\nReason: ${props.reason}\nStatus: ${props.status}\nPhone: ${props.phone}`;
  }

  handleEventMouseLeave(arg: any): void {
    // Remove tooltip
    arg.el.title = '';
  }

  showAppointmentDetails(appointment: Appointment): void {
    const modalRef = this.modalService.open(AppointmentDetailsModalComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'appointment-details-modal'
    });

    modalRef.componentInstance.appointment = appointment;

    modalRef.result.then(
      (result) => {
        // Handle modal close with result if needed
        console.log('Modal closed with result:', result);
      },
      (dismissed) => {
        // Handle modal dismissal
        console.log('Modal dismissed');
      }
    );
  }

  getDefaultFilters(): any {
    var obj: any = {
      fromDate: this.form.value.fromDate || "",
      toDate: this.form.value.toDate || "",
      contactName: this.form.value.searchText || null,
      email: this.form.value.email || null,
      phone: this.form.value.phone || null,
      isNewClient: this.form.value.patientType === 'new' ? true :
      this.form.value.patientType === 'returning' ? false : null,
      locationName: this.form.value.location || null,
      appStatus: this.form.value.appStatus || null
    };
    return obj;
  }

  // Utility methods for calendar navigation
  goToToday(): void {
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.today();
    }
  }

  changeView(view: string): void {
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.changeView(view);
    }
  }

  refreshCalendar(): void {
    this.loadAppointments();
  }

  // Statistical methods for the dashboard cards
  getAppointmentCountByStatus(status: number): number {
    return this.appointments.filter(appointment => appointment.appStatus === status).length;
  }

  getNewClientCount(): number {
    return this.appointments.filter(appointment => appointment.isNewClient).length;
  }
}
