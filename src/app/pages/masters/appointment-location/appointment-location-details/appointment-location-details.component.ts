import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { Location } from '@angular/common';
import { AppointmentLocationService } from 'src/app/providers/services/appointment-location.service';

@Component({
  selector: 'app-appointment-location-details',
  templateUrl: './appointment-location-details.component.html',
  styleUrls: ['./appointment-location-details.component.scss']
})

export class AppointmentLocationDetailsComponent implements OnInit {

  form: FormGroup;
  public appCommon = appCommon;
  submitLoading: boolean = false;
  recordData: any = null;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastrMessageService: ToastrMessageService,
    private location: Location,
    private router: Router,
    private service: AppointmentLocationService,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService,

  ) { }

  ngOnInit(): void {


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
      name: ["", [Validators.required]],
      address: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      zipCode: ["", [Validators.required]],
      mapUrl: [""]
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
                table: 'Appointment Location',
                id: this.form.value.id,
                name: this.form.value.name,
                address: this.form.value.address,
                city: this.form.value.city,
                state: this.form.value.state,
                zipCode: this.form.value.zipCode,
                mapUrl: this.form.value.mapUrl
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['masters/appointment-location']);
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
                table: 'Appointment Location',
                id: data,
                name: this.form.value.name,
                address: this.form.value.address,
                city: this.form.value.city,
                state: this.form.value.state,
                zipCode: this.form.value.zipCode,
                mapUrl: this.form.value.mapUrl
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['masters/appointment-location']);
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
        name: this.recordData.name,
        address: this.recordData.address,
        city: this.recordData.city,
        state: this.recordData.state,
        zipCode: this.recordData.zipCode,
        mapUrl: this.recordData.mapUrl
      });
    }
  }
}