import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appCommon } from 'src/app/common/_appCommon';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailTemplateService } from 'src/app/providers/services/email-template.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
@Component({
  selector: 'app-email-template-new',
  templateUrl: './email-template-new.component.html',
  styleUrls: ['./email-template-new.component.scss']
})
export class EmailTemplateNewComponent implements OnInit {

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
    private service: EmailTemplateService,
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
      name: [""],
      subject: ["", [Validators.required]],
      text: ["", [Validators.required]],
      type: [null, [Validators.required]],
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
                table: 'Email Template',
                id: this.form.value.id,
                name: this.form.value.name,
                subject: this.form.value.subject,
                text: this.form.value.text,
                type: this.form.value.type,
                isPublished: this.form.value.isPublished
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['admin/email-template']);
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
                table: 'Email Template',
                id: data.data.id,
                name: this.form.value.name,
                subject: this.form.value.subject,
                text: this.form.value.text,
                type: this.form.value.type,
                isPublished: this.form.value.isPublished
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['admin/email-template']);
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
        subject: this.recordData.subject,
        text: this.recordData.text,
        type: this.recordData.type,
        isPublished: this.recordData.isPublished,
      });
    }
  }
}
