import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { CustomMessageService } from 'src/app/providers/services/custom-message.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { Location } from '@angular/common';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
@Component({
  selector: 'app-custom-message-new',
  templateUrl: './custom-message-new.component.html',
  styleUrls: ['./custom-message-new.component.scss']
})
export class CustomMessageNewComponent implements OnInit {

  form: FormGroup;
  public appCommon = appCommon;
  submitLoading: boolean = false;
  recordData: any = null;
  submitted: boolean = false;
  public Editor = ClassicEditor;

  constructor(
    private fb: FormBuilder,
    private toastrMessageService: ToastrMessageService,
    private location: Location,
    private router: Router,
    private service: CustomMessageService,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService) { }

  ngOnInit(): void {
    this.createForm();

    if (this.route.snapshot.data['recordData'])
      this.recordData = this.route.snapshot.data['recordData'].data;
    if (this.recordData) {
      this.setFormValues();
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      type: [null, [Validators.required]],
      shortName: ["", [Validators.required]],
      heading: ["", [Validators.required]],
      text: ["", [Validators.required]],
      isPublished: [true]
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
                table: 'Custom Message',
                id: this.form.value.id,
                type: this.form.value.type,
                shortName: this.form.value.shortName,
                heading: this.form.value.heading,
                text: this.form.value.text,
                isPublished: this.form.value.isPublished,
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['admin/custom-message']);
            },
            error => {
              this.submitLoading = false;
              this.toastrMessageService.showInfo(error.error.message, "Info");
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
                table: 'Custom Message',
                id: data.data.id,
                type: this.form.value.type,
                shortName: this.form.value.shortName,
                heading: this.form.value.heading,
                text: this.form.value.text,
                isPublished: this.form.value.isPublished,
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['admin/custom-message']);
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
        type: this.recordData.type,
        shortName: this.recordData.shortName,
        heading: this.recordData.heading,
        text: this.recordData.text,
        isPublished: this.recordData.isPublished,
      });
    }
  }
}