import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appCommon } from 'src/app/common/_appCommon';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailSettingService } from 'src/app/providers/services/email-setting.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
@Component({
  selector: 'app-email-setting-new',
  templateUrl: './email-setting-new.component.html',
  styleUrls: ['./email-setting-new.component.scss']
})
export class EmailSettingNewComponent implements OnInit {

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
    private service: EmailSettingService,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService,

  ) { }

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
      sendEmailAddress: ["", [Validators.required]],
      password: ["", [Validators.required]],
      outgoingMailServer: ["", [Validators.required]],
      smtpPort: [Number, [Validators.required]],
      isPublished: [true],
      receiverEmailAddress: ["", [Validators.required]]
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
                table: 'Email Setting',
                id: this.form.value.id,
                sendEmailAddress: this.form.value.sendEmailAddress,
                password: this.form.value.password,
                outgoingMailServer: this.form.value.outgoingMailServer,
                smtpPort: this.form.value.smtpPort,
                isPublished: this.form.value.isPublished,
                receiverEmailAddress: this.form.value.receiverEmailAddress,
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['admin/email-setting']);
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
                table: 'Email Setting',
                id: data.data.id,
                sendEmailAddress: this.form.value.sendEmailAddress,
                password: this.form.value.password,
                outgoingMailServer: this.form.value.outgoingMailServer,
                smtpPort: this.form.value.smtpPort,
                isPublished: this.form.value.isPublished,
                receiverEmailAddress: this.form.value.receiverEmailAddress
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['admin/email-setting']);
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
        sendEmailAddress: this.recordData.sendEmailAddress,
        password: this.recordData.password,
        outgoingMailServer: this.recordData.outgoingMailServer,
        smtpPort: this.recordData.smtpPort,
        isPublished: this.recordData.isPublished,
        receiverEmailAddress: this.recordData.receiverEmailAddress
      });
    }
  }
}