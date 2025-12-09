import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { GeneralInsuranceService } from 'src/app/providers/services/general-insurance.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-general-insurance-details',
  templateUrl: './general-insurance-details.component.html',
  styleUrls: ['./general-insurance-details.component.scss']
})
export class GeneralInsuranceDetailsComponent implements OnInit {

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
    private service: GeneralInsuranceService,
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
                table: 'General Insurance',
                id: this.form.value.id,
                name: this.form.value.name,
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['masters/general-insurance']);
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
                table: 'General Insurance',
                id: data,
                name: this.form.value.name
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['masters/general-insurance']);
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
      });
    }
  }
}