import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { AppointmentDailySlotService } from 'src/app/providers/services/appointment-daily-slot.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { Location } from '@angular/common';
import { AppointmentLocationService } from 'src/app/providers/services/appointment-location.service';

@Component({
  selector: 'app-appointment-daily-slot-details',
  templateUrl: './appointment-daily-slot-details.component.html',
  styleUrls: ['./appointment-daily-slot-details.component.scss']
})

export class AppointmentDailySlotDetailsComponent implements OnInit {

  form: FormGroup;
  public appCommon = appCommon;
  submitLoading: boolean = false;
  recordData: any = null;
  submitted: boolean = false;
  locationList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private toastrMessageService: ToastrMessageService,
    private location: Location,
    private router: Router,
    private service: AppointmentDailySlotService,
    private locationService: AppointmentLocationService,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService,

  ) { }

  ngOnInit(): void {
    this.getLocationList();
    this.createForm();
    if (this.route.snapshot.data['recordData'])
      this.recordData = this.route.snapshot.data['recordData'];
    if (this.recordData) {
      this.setFormValues();
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      locationId: ["", [Validators.required]],
      dayOfWeek: ["", [Validators.required]],
      startTime: ["", [Validators.required]],
      endTime: ["", [Validators.required]],
      slotDuration: [0, [Validators.required]]
    })
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {

      console.log(this.form.errors);
      return;
    } else {
      this.submitLoading = true;
      var fdata = this.form.value;
      if (fdata.id) {
        this.service.update(fdata)
          .subscribe(
            data => {

              this.submitLoading = false;
              this.toastrMessageService.showSuccess("Record updated successfully.", "Success");
              var listRec = {
                table: 'Appointment Daily Slot',
                id: this.form.value.id,
                locationId: this.form.value.locationId,
                dayOfWeek: this.form.value.dayOfWeek,
                startTime: this.form.value.startTime,
                endTime: this.form.value.endTime,
                slotDuration: this.form.value.slotDuration
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['masters/appointment-daily-slot']);
            },
            error => {
              this.submitLoading = false;
              this.toastrMessageService.showSuccess(error.error.message, "Info");
            }
          )
      }
      else {

        this.service.create(fdata)
          .subscribe(
            data => {
              this.submitLoading = false;
              this.toastrMessageService.showSuccess("New record created successfully", "Success");

              var listRec = {
                table: 'Appointment Daily Slot',
                id: data,
                locationId: this.form.value.locationId,
                dayOfWeek: this.form.value.dayOfWeek,
                startTime: this.form.value.startTime,
                endTime: this.form.value.endTime,
                slotDuration: this.form.value.slotDuration
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['masters/appointment-daily-slot']);
            },
            error => {
              this.submitLoading = false;
              this.toastrMessageService.showInfo(error.error.message, "Info");
            }
          )
      }
    }
  }

  onBackClick() {
    this.location.back();
  }

  clear() {
    if (this.recordData) {
      this.setFormValues();
    }
    else {
      this.form.reset();
    }
  }

  setFormValues() {
    if (this.recordData) {
      this.form.patchValue({
        id: this.recordData.id,
        locationId: this.recordData.locationId,
        dayOfWeek: this.recordData.dayOfWeek,
        startTime: this.recordData.startTime,
        endTime: this.recordData.endTime,
        slotDuration: this.recordData.slotDuration
      });
    }
  }

  // for locationId id call 
  getLocationList() {
    var fdata = {};
    this.locationService.list(fdata).subscribe(
      data => {
        this.locationList = data;
      },
      error => {
        this.toastrMessageService.showError(error.error.message, "Error");
      }
    );
  }

}