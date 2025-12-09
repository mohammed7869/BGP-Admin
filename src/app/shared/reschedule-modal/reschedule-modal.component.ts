import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from 'src/app/providers/services/appointment.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { AppointmentDailySlotService } from 'src/app/providers/services/appointment-daily-slot.service';
import { AppointmentLocationService } from 'src/app/providers/services/appointment-location.service';
import { ErrorUtils } from 'src/app/common/error-utils';

export interface RescheduleStep {
  id: string;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

@Component({
  selector: 'app-reschedule-modal',
  templateUrl: './reschedule-modal.component.html',
  styleUrls: ['./reschedule-modal.component.scss']
})
export class RescheduleModalComponent implements OnInit, OnDestroy {
  @Input() appointment: any; // Should be of type Appointment

  currentStep = 'find-time';
  steps: RescheduleStep[] = [
    { id: 'find-time', title: 'FIND A TIME', isActive: true, isCompleted: false },
    { id: 'appt-details', title: 'APPT DETAILS', isActive: false, isCompleted: false }
  ];

  // Track if user has clicked continue in APPT DETAILS tab
  showAppointmentComparison = false;

  // Form for new appointment details
  rescheduleForm: FormGroup;

  // Dynamic data from API
  locations: any[] = [];
  appointmentSlots: any[] = [];

  // Loading states
  locationsLoading = false;
  timeSlotsLoading = false;
  isRescheduling = false;

  selectedDate: string;
  selectedTime: string;
  selectedProvider: string = 'Not Available';
  selectedLocationId: any | null = null;
  selectedLocation: string = '';
  selectedReason: string = '';

  // Date range for navigation (initialize with current date, showing 4 days)
  currentDateRange = {
    start: (() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    })(),
    end: (() => {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 2); // 4 days total (including start date)
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, '0');
      const day = String(endDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    })()
  };

  // Store available slots by location and date
  availableSlots: { [key: string]: string[] } = {};
  loadingSlots: { [key: string]: boolean } = {};

  // Store booked slots data
  bookedSlots: any[] = [];
  bookedSlotsLoaded = false;
  
  // Timer for refreshing time slots
  private timeSlotRefreshTimer: any;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private appointmentDailySlotService: AppointmentDailySlotService,
    private appointmentLocationService: AppointmentLocationService,
    private toastrMessageService: ToastrMessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.selectedDate = this.currentDateRange.start;
    this.selectedReason = this.appointment?.reasonForVisit || '';
    // Load both locations and appointment slots
    this.getLocations();
    this.getAppointmentSlots();
    
    // Set up a timer to refresh time slots every minute to handle time progression
    this.setupTimeSlotRefresh();
  }

  ngOnDestroy(): void {
    // Clear the timer when component is destroyed
    if (this.timeSlotRefreshTimer) {
      clearInterval(this.timeSlotRefreshTimer);
    }
  }

  initForm(): void {
    this.rescheduleForm = this.fb.group({
      newDate: ['', Validators.required],
      newTime: ['', Validators.required],
      provider: [this.selectedProvider],
      locationId: [this.selectedLocationId, Validators.required],
      reasonForVisit: [this.selectedReason]
    });
  }

  // Handle location change
  onLocationChange(locationId: number): void {
    this.selectedLocationId = locationId;
    const location = this.locations.find(loc => loc.id == locationId);
    this.selectedLocation = location ? location.name : '';

    // Reset selected time when location changes
    this.selectedTime = '';
    this.selectedDate = this.currentDateRange.start;

    // Clear existing slots and load new ones
    this.availableSlots = {};
    this.loadingSlots = {};

    // Load booked slots for the selected location and current date range
    this.loadBookedSlots();

    // Load time slots for the newly selected location
    if (this.appointmentSlots.length > 0) {
      this.loadTimeSlotsForLocation();
    }

    this.rescheduleForm.patchValue({
      locationId: locationId,
      newTime: '',
      newDate: this.selectedDate
    });
  }

  // Step navigation
  setActiveStep(stepId: string): void {
    this.steps.forEach(step => {
      step.isActive = step.id == stepId;
    });
    this.currentStep = stepId;

    // Reset comparison state when going back to FIND A TIME
    if (stepId == 'find-time') {
      this.showAppointmentComparison = false;
    }
  }

  // Time slot selection
  selectTimeSlot(date: string, time: string): void {
    // Ensure date is in correct format (YYYY-MM-DD) and handle timezone issues
    // Parse as local date to avoid timezone shifts
    const dateParts = date.split('-').map(Number);
    if (dateParts.length === 3) {
      const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      date = `${year}-${month}-${day}`;
    }
    
    // Prevent selection of disabled time slots
    if (this.isTimeSlotDisabled(date, time)) {
      const reason = this.getTimeSlotDisabledReason(date, time);
      this.toastrMessageService.showWarning(`Cannot select this time slot: ${reason}`, 'Time Slot Unavailable');
      return;
    }
    
    this.selectedDate = date;
    this.selectedTime = time;
    this.rescheduleForm.patchValue({
      newDate: date,
      newTime: time
    });
  }

  // Date range navigation
  navigateDateRange(direction: 'prev' | 'next'): void {
    // Parse dates as local dates to avoid timezone issues
    const startParts = this.currentDateRange.start.split('-').map(Number);
    const endParts = this.currentDateRange.end.split('-').map(Number);
    const currentStart = new Date(startParts[0], startParts[1] - 1, startParts[2]);
    const currentEnd = new Date(endParts[0], endParts[1] - 1, endParts[2]);

    if (direction == 'next') {
      currentStart.setDate(currentStart.getDate() + 3);
      currentEnd.setDate(currentEnd.getDate() + 3);
    } else {
      // Don't go before today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const newStart = new Date(currentStart);
      newStart.setDate(newStart.getDate() - 3);

      if (newStart >= today) {
        currentStart.setDate(currentStart.getDate() - 3);
        currentEnd.setDate(currentEnd.getDate() - 3);
      } else {
        return; // Don't navigate to past dates
      }
    }

    // Format dates as YYYY-MM-DD using local date components
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    this.currentDateRange = {
      start: formatDate(currentStart),
      end: formatDate(currentEnd)
    };

    // Reset selected time and date
    this.selectedTime = '';
    this.selectedDate = this.currentDateRange.start;

    // Load booked slots for new date range if location is selected
    if (this.selectedLocationId) {
      this.loadBookedSlots();
      this.loadTimeSlotsForLocation();
    }

    // Reload time slots for new date range
    //this.loadTimeSlotsForCurrentDateRange();
  }

  // Continue to next step
  continue(): void {
    if (this.currentStep == 'find-time') {
      if (this.selectedDate && this.selectedTime) {
        this.steps[0].isCompleted = true;
        this.setActiveStep('appt-details');
        this.showAppointmentComparison = true; // Show comparison immediately when entering APPT DETAILS
      }
    } else if (this.currentStep == 'appt-details') {
      // Directly confirm reschedule since comparison is already shown
      this.confirmReschedule();
    }
  }

  // Confirm the reschedule
  confirmReschedule(): void {
    if (this.rescheduleForm.valid && this.appointment?.id) {
      // Show confirmation dialog before proceeding
      const patientName = `${this.appointment?.firstName} ${this.appointment?.lastName}` || 'Patient';
      const selectedLocationName = this.getSelectedLocationName();
      // Parse date as local date to avoid timezone issues
      const dateParts = this.selectedDate.split('-').map(Number);
      const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const formattedDate = localDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const confirmationMessage = `Are you sure you want to reschedule this appointment?\n\n` +
        `Patient: ${patientName}\n` +
        `New Date: ${formattedDate}\n` +
        `New Time: ${this.selectedTime}\n` +
        `Location: ${selectedLocationName}`;

      if (!confirm(confirmationMessage)) {
        return; // User cancelled, don't proceed
      }

      // User confirmed, proceed with reschedule
      this.processReschedule();
    } else {
      this.toastrMessageService.showWarning('Please ensure all fields are completed.', 'Warning');
    }
  }

  // Process the actual reschedule after confirmation
  private processReschedule(): void {
    // Set loading state
    this.isRescheduling = true;
    
    // Get the selected slot for the location and selected date
    // Parse date as local date to avoid timezone issues
    const dateParts = this.selectedDate.split('-').map(Number);
    const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    const calculatedDayOfWeek = localDate.getDay();
    const selectedSlot = this.appointmentSlots.find(slot => 
      slot.locationId == this.selectedLocationId && 
      slot.dayOfWeek == calculatedDayOfWeek
    );
    
    // Use dayOfWeek from the selected slot, fallback to calculated if not found
    const dayOfWeek = selectedSlot?.dayOfWeek ?? calculatedDayOfWeek;
    
    // Get duration from slot data or default to 30 minutes
    const slotDurationMinutes = this.getSlotDurationInMinutes(selectedSlot?.slotDuration || 2);
    const endTime = this.calculateEndTime(this.selectedTime, slotDurationMinutes);
    
    // Prepare reschedule request for the API in the new format
    const rescheduleRequest: any = {
      id: this.appointment.id,
      appointmentDateTime: this.combineDateTime(this.selectedDate, this.selectedTime),
      locationId: parseInt(this.selectedLocationId) || 0,
      dayOfWeek: dayOfWeek,
      startTime: this.convertTimeToSimpleFormat(this.selectedTime),
      endTime: endTime
    };

    console.log('Reschedule request:', rescheduleRequest);
    console.log('Selected slot info:', selectedSlot);

    // Call the reschedule API
    this.appointmentService.reschedule(rescheduleRequest).subscribe({
      next: (response) => {
        // Clear loading state
        this.isRescheduling = false;
        
        // Clear the cache when reschedule is successful
        //  this.rescheduleService.clearDailyTimeSlotsCache();

        // Close the modal with success data
        const rescheduleData = {
          appointmentId: this.appointment.id,
          originalAppointment: this.appointment,
          newAppointment: {
            appointmentDate: this.selectedDate,
            appointmentTime: this.selectedTime,
            endTime: endTime,
            provider: this.selectedProvider,
            location: this.getSelectedLocationName(),
            locationId: this.selectedLocationId,
            reasonForVisit: this.selectedReason
          }
        };

        this.activeModal.close(rescheduleData);

        // Show success message
        const patientName = `${this.appointment?.firstName} ${this.appointment?.lastName}` || '';
        const patientEmail = this.appointment?.email || '';
        const successMessage = `Appointment rescheduled successfully! ${patientEmail ? `An email will be sent to ${patientName} at ${patientEmail} letting them know about the change.` : ''}`;

        this.toastrMessageService.showSuccess(successMessage, 'Success');
      },
      error: (error) => {
        // Clear loading state on error
        this.isRescheduling = false;
        
        console.error('Error rescheduling appointment:', error);
        const errorMessage = ErrorUtils.extractErrorMessage(error);
        this.toastrMessageService.showError(errorMessage, 'Error');
      }
    });
  }

  // Helper method to combine date and time
  private combineDateTime(date: string, time: string): string {
    // Parse date as local date to avoid timezone issues
    const dateParts = date.split('-').map(Number);
    const appointmentDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    const [hours, minutes] = time.split(':').map(Number);

    appointmentDate.setHours(hours, minutes, 0, 0);
    return appointmentDate.toISOString();
  }

  // Helper method to convert slot duration ID to minutes
  private getSlotDurationInMinutes(slotDurationId: number): number {
    // EnTimeSlots mapping:
    // 1: '15 Mins' = 15 minutes
    // 2: '30 Mins' = 30 minutes  
    // 3: '45 Mins' = 45 minutes
    // 4: '1 Hour' = 60 minutes
    switch (slotDurationId) {
      case 1: return 15;
      case 2: return 30;
      case 3: return 45;
      case 4: return 60;
      default: return 30; // Default to 30 minutes if unknown
    }
  }

  // Helper method to convert time to simple format (HH:mm)
  private convertTimeToSimpleFormat(timeString: string): string {
    // Time is already in 24-hour format (HH:mm), just return as is
    return timeString;
  }

  // Helper method to calculate end time
  private calculateEndTime(startTimeString: string, durationMinutes: number): string {
    const [hours, minutes] = startTimeString.split(':').map(Number);

    // Create a date object to handle time calculation
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0);
    
    // Add duration in minutes
    const endTime = new Date(startTime.getTime() + (durationMinutes * 60 * 1000));
    
    // Return in HH:mm format
    return `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  }

  // Helper method to convert time to ticks
  private convertTimeToTicks(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);

    // Convert to .NET ticks (100 nanoseconds)
    return (hours * 36000000000) + (minutes * 600000000);
  }

  // Cancel reschedule
  cancel(): void {
    // Clear the cache when modal is cancelled
    // this.rescheduleService.clearDailyTimeSlotsCache();
    this.activeModal.dismiss();
  }

  // Helper methods
  getAvailableDates(): string[] {
    const dates: string[] = [];
    // Parse dates as local dates to avoid timezone issues
    const startDateParts = this.currentDateRange.start.split('-').map(Number);
    const endDateParts = this.currentDateRange.end.split('-').map(Number);
    const startDate = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2]);
    const endDate = new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2]);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const current = new Date(startDate);
    while (current <= endDate) {
      // Only include dates that are today or in the future
      if (current >= today) {
        // Format as YYYY-MM-DD using local date components
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        dates.push(`${year}-${month}-${day}`);
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }



  getSelectedLocationName(): string {
    if (this.selectedLocationId && this.locations.length > 0) {
      const location = this.locations.find(loc => loc.id == this.selectedLocationId);
      return location ? `${location.name}, ${location.address}, ${location.city}, ${location.state}, ${location.zipcode}` : this.selectedLocation;
    }
    return this.selectedLocation;
  }

  isTimeSlotSelected(date: string, time: string): boolean {
    return this.selectedDate == date && this.selectedTime == time;
  }

  formatDate(dateStr: string): string {
    // Parse date as local date to avoid timezone issues
    const dateParts = dateStr.split('-').map(Number);
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const day = date.getDate();
    const dayName = days[date.getDay()];
    return `${dayName} ${day}`;
  }

  formatTime(timeString: string): string {
    if (!timeString) return 'N/A';
    // Time is already in 24-hour format (HH:mm), just return as is
    return timeString;
  }

  // Helper methods to separate morning, afternoon, and evening slots
  getMorningSlots(date: string): string[] {
    const cacheKey = `${this.selectedLocationId}-${date}`;
    const allSlots = this.availableSlots[cacheKey] || [];

    return allSlots.filter(time => {
      const [hours] = time.split(':').map(Number);

      // Morning: 00:00 to 11:59 (0-11 hours)
      return hours >= 0 && hours < 12;
    });
  }

  getAfternoonSlots(date: string): string[] {
    const cacheKey = `${this.selectedLocationId}-${date}`;
    const allSlots = this.availableSlots[cacheKey] || [];

    return allSlots.filter(time => {
      const [hours] = time.split(':').map(Number);

      // Afternoon: 12:00 to 16:59 (12:00 PM to 4:59 PM)
      return hours >= 12 && hours < 17;
    });
  }

  getEveningSlots(date: string): string[] {
    const cacheKey = `${this.selectedLocationId}-${date}`;
    const allSlots = this.availableSlots[cacheKey] || [];

    return allSlots.filter(time => {
      const [hours] = time.split(':').map(Number);

      // Evening: 17:00 to 23:59 (5:00 PM to 11:59 PM)
      return hours >= 17 && hours < 24;
    });
  }

  canContinue(): boolean {
    if (this.currentStep == 'find-time') {
      // Check if selected time slot is not disabled
      const isTimeSlotValid = this.selectedDate && this.selectedTime && this.selectedLocationId && 
                             !this.isTimeSlotDisabled(this.selectedDate, this.selectedTime);
      return !!isTimeSlotValid;
    } else if (this.currentStep == 'appt-details') {
      // Enable continue button in APPT DETAILS only if time and location were selected in FIND A TIME
      // and the time slot is not disabled
      const isTimeSlotValid = this.selectedDate && this.selectedTime && this.selectedLocationId && 
                             !this.isTimeSlotDisabled(this.selectedDate, this.selectedTime);
      return !!isTimeSlotValid;
    }
    return true;
  }

  getLocations() {
    this.locationsLoading = true;
    this.appointmentLocationService.getAllLocation()
      .subscribe(
        data => {
          this.locations = data;
          this.locationsLoading = false;

          // If there's exactly one location, automatically select it
          if (this.locations.length == 1) {
            this.selectedLocationId = this.locations[0].id;
            this.selectedLocation = this.locations[0].name;
            this.rescheduleForm.patchValue({ locationId: this.selectedLocationId });

            // Load booked slots for the selected location
            this.loadBookedSlots();

            // Load time slots if appointment slots data is already available
            if (this.appointmentSlots.length > 0) {
              this.loadTimeSlotsForLocation();
            }
          }
        },
        error => {
          const errorMessage = ErrorUtils.extractErrorMessage(error);
          this.toastrMessageService.showInfo(errorMessage, "Info");
          this.locations = [];
          this.locationsLoading = false;
        });
  }

  loadTimeSlotsForLocation() {
    if (!this.selectedLocationId) {
      console.log('No location selected');
      return;
    }

    if (this.appointmentSlots.length == 0) {
      console.log('No appointment slots data available');
      return;
    }

    console.log('Loading time slots for location:', this.selectedLocationId);
    console.log('Available appointment slots:', this.appointmentSlots);

    const dates = this.getAvailableDates();
    dates.forEach(dateStr => {
      const cacheKey = `${this.selectedLocationId}-${dateStr}`;

      // Skip if already loaded
      if (this.availableSlots[cacheKey]) {
        console.log(`Slots already loaded for ${cacheKey}`);
        return;
      }

      
      // Set loading state
      this.loadingSlots[cacheKey] = true;

      // Extract time slots for this day from appointmentSlots
      // Parse date as local date to avoid timezone issues
      const dateParts = dateStr.split('-').map(Number);
      const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const dayOfWeek = localDate.getDay();
      console.log(`Processing date: ${dateStr}, dayOfWeek: ${dayOfWeek}`);

      const availableSlots = this.appointmentSlots
        .filter(slot =>
          slot.locationId == this.selectedLocationId &&
          slot.dayOfWeek == dayOfWeek
        );

      console.log(`Found ${availableSlots.length} slots for location ${this.selectedLocationId} on day ${dayOfWeek}:`, availableSlots);

      const allTimeSlots: string[] = [];

      availableSlots.forEach(slot => {
        const startTime = new Date(`2000-01-01T${slot.startTime}`);
        const endTime = new Date(`2000-01-01T${slot.endTime}`);
        
        // Get the actual slot duration in minutes from the slot data
        const slotDurationMinutes = this.getSlotDurationInMinutes(slot.slotDuration);

        // Generate slots based on the actual slot duration
        let currentTime = new Date(startTime);
        while (currentTime < endTime) {
          allTimeSlots.push(
            currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          );
          // Add the actual slot duration in minutes
          currentTime.setMinutes(currentTime.getMinutes() + slotDurationMinutes);
        }
      });

      // Sort and remove duplicates
      const slotsForDay = [...new Set(allTimeSlots)].sort((a, b) => {
        const timeA = new Date(`2000-01-01 ${a}`);
        const timeB = new Date(`2000-01-01 ${b}`);
        return timeA.getTime() - timeB.getTime();
      });

      // Filter out past time slots for today
      const todayDate = new Date();
      const todayYear = todayDate.getFullYear();
      const todayMonth = String(todayDate.getMonth() + 1).padStart(2, '0');
      const todayDay = String(todayDate.getDate()).padStart(2, '0');
      const today = `${todayYear}-${todayMonth}-${todayDay}`;
      let filteredSlots = slotsForDay;
      
      if (dateStr === today) {
        filteredSlots = slotsForDay.filter(time => !this.isTimeSlotInPast(dateStr, time));
        console.log(`Filtered out past time slots for today. Original: ${slotsForDay.length}, Filtered: ${filteredSlots.length}`);
      }

      console.log(`Generated ${filteredSlots.length} available time slots for ${dateStr}:`, filteredSlots);

      // Set the slots and clear loading state
      this.availableSlots[cacheKey] = filteredSlots;
      this.loadingSlots[cacheKey] = false;
    });
  }

  getAppointmentSlots() {
    this.appointmentDailySlotService.getAllSlots()
      .subscribe(
        data => {
          this.appointmentSlots = data;
          // Load time slots if location is already selected (for single location case)
          if (this.selectedLocationId) {
            this.loadTimeSlotsForLocation();
          }
        },
        error => {
          const errorMessage = ErrorUtils.extractErrorMessage(error);
          this.toastrMessageService.showInfo(errorMessage, "Info");
          this.appointmentSlots = [];
        });
  }

  loadBookedSlots() {
    if (!this.selectedLocationId) {
      console.log('No location selected for booked slots');
      return;
    }

    // Calculate date range for the current week (4 days from start date)
    // Parse dates as local dates to avoid timezone issues
    const startParts = this.currentDateRange.start.split('-').map(Number);
    const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2]);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2); // 4 days total

    const bookedSlotsRequest = {
      fromDate: startDate.toISOString(),
      toDate: endDate.toISOString(),
      locationId: this.selectedLocationId
    };

    console.log('Loading booked slots:', bookedSlotsRequest);

    this.appointmentService.getBookedSlots(bookedSlotsRequest)
      .subscribe(
        data => {
          this.bookedSlots = data || [];
          this.bookedSlotsLoaded = true;
          console.log('Loaded booked slots:', this.bookedSlots);
          
          // Refresh time slots to apply booking status
          if (this.appointmentSlots.length > 0) {
            this.loadTimeSlotsForLocation();
          }
        },
        error => {
          const errorMessage = ErrorUtils.extractErrorMessage(error);
          console.error('Error loading booked slots:', errorMessage);
          this.bookedSlots = [];
          this.bookedSlotsLoaded = true;
        });
  }

  // Check if a specific time slot is booked
  isTimeSlotBooked(date: string, time: string): boolean {
    if (!this.bookedSlotsLoaded || this.bookedSlots.length === 0) {
      return false;
    }

    // Convert time to 24-hour format for comparison
    const timeIn24Hour = this.convertTo24HourFormat(time);
    
    // Check if this date and time combination is in booked slots
    return this.bookedSlots.some(slot => {
      // Extract date from slot without timezone conversion
      const slotDateStr = slot.SlotDate.substring(0, 10); // Get YYYY-MM-DD from ISO string
      const startTime = slot.StartTime.substring(0, 5); // Get HH:mm from HH:mm:ss
      
      return slotDateStr === date && startTime === timeIn24Hour;
    });
  }

  // Check if a time slot is in the past (disabled)
  isTimeSlotInPast(date: string, time: string): boolean {
    const now = new Date();
    // Parse date as local date to avoid timezone issues
    const dateParts = date.split('-').map(Number);
    const slotDateTime = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    const [hours, minutes] = time.split(':').map(Number);
    slotDateTime.setHours(hours, minutes, 0, 0);
    
    // Add a small buffer (2 minutes) to allow for current time
    const bufferTime = new Date(now.getTime() + (2 * 60 * 1000));
    
    return slotDateTime <= bufferTime;
  }

  // Check if a time slot should be disabled (either booked or in the past)
  isTimeSlotDisabled(date: string, time: string): boolean {
    return this.isTimeSlotBooked(date, time) || this.isTimeSlotInPast(date, time);
  }

  // Get disabled reason for a time slot
  getTimeSlotDisabledReason(date: string, time: string): string {
    if (this.isTimeSlotBooked(date, time)) {
      return 'This time slot is already booked';
    }
    if (this.isTimeSlotInPast(date, time)) {
      return 'This time slot is in the past';
    }
    return '';
  }

  // Get current time for display
  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  // Get current date for display
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get next available time slot for today
  getNextAvailableTimeSlot(): string | null {
    const today = this.getCurrentDate();
    const cacheKey = `${this.selectedLocationId}-${today}`;
    const todaySlots = this.availableSlots[cacheKey] || [];
    
    if (todaySlots.length === 0) {
      return null;
    }
    
    // Find the first available (not disabled) time slot
    const availableSlot = todaySlots.find(time => !this.isTimeSlotDisabled(today, time));
    return availableSlot || null;
  }

  // Check if a date has any available time slots
  hasAvailableTimeSlots(date: string): boolean {
    const cacheKey = `${this.selectedLocationId}-${date}`;
    const slots = this.availableSlots[cacheKey] || [];
    
    // Check if there are any slots that are not disabled
    return slots.some(time => !this.isTimeSlotDisabled(date, time));
  }

  // Helper method to ensure time is in 24-hour format (already in 24-hour format)
  private convertTo24HourFormat(timeString: string): string {
    // Time is already in 24-hour format (HH:mm), just return as is
    return timeString;
  }

  // Set up timer to refresh time slots every minute
  private setupTimeSlotRefresh(): void {
    // Refresh time slots every minute to handle time progression
    this.timeSlotRefreshTimer = setInterval(() => {
      if (this.selectedLocationId && this.appointmentSlots.length > 0) {
        // Only refresh if we have data loaded
        this.loadTimeSlotsForLocation();
      }
    }, 60000); // 60000ms = 1 minute
  }
} 