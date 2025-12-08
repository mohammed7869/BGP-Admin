import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { UserService } from 'src/app/providers/services/user.service';


@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.scss']
})
export class UserNewComponent implements OnInit {
  form: FormGroup;
  isBtnLoading: boolean = false;
  loginSuccessSubscription: Subscription;
  isOnItEvent: boolean = false;
  submitted: boolean = false;
  recordData: any = {};
  public appCommon = appCommon;
  roleList: any = [];

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private toastrMessageService: ToastrMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService) {
  }

  ngOnInit(): void {

    this.createForm();
    if (this.route.snapshot.data['recordData']) {
      this.recordData = this.route.snapshot.data['recordData'];
      this.setFormValues();
    }
  }

  setFormValues() {
    if (this.recordData) {
      this.form.patchValue({
        id: this.recordData.id,
        fullName: this.recordData.fullName,
        userName: this.recordData.userName,
        phoneNumber: this.recordData.phoneNumber,
        roleId: this.recordData.roleId,
        email: this.recordData.email,
        password: this.recordData.password,
        confirmPassword: this.recordData.confirmPassword,
      });
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      fullName: [null, Validators.required],
      userName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      roleId: [null, Validators.required],
      email: [null, Validators.required, Validators.email],
      password: [null],
      confirmPassword: [null],
    },
      {
        Validators: this.passwordMismatch('Password', 'ConfirmPassword')
      }
    );

  }

  clear() {
    if (this.recordData) {
      this.setFormValues();
    }
    else {
      this.form.reset();
    }
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    }
    else {
      this.isBtnLoading = true;
      var fdata = JSON.parse(JSON.stringify(this.form.value));
      console.log(fdata);

      if (fdata.id) {
        this.userService.update(fdata)
          .subscribe(
            data => {
              this.isBtnLoading = false;
              this.toastrMessageService.showSuccess("Record updated successfully.", "Info");
              var listRec = {
                table: 'User',
                id: this.form.value.id,
                fullName: this.form.value.fullName,
                userName: this.form.value.userName,
                phoneNumber: this.form.value.phoneNumber,
                roleId: this.form.value.roleId,
                email: this.form.value.email,
                password: this.form.value.password,
                confirmPassword: this.form.value.confirmPassword,
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['admin/user']);
            },
            error => {
              this.isBtnLoading = false;
              this.toastrMessageService.showInfo(error.message, "Info");
            }
          )
      }
      else {
        this.userService.create(fdata)
          .subscribe(
            data => {
              this.isBtnLoading = false;
              this.toastrMessageService.showSuccess("Record created successfully.", "Info");
              var listRec = {
                table: 'User',
                id: data.id,
                fullName: this.form.value.fullName,
                userName: this.form.value.userName,
                phoneNumber: this.form.value.phoneNumber,
                roleId: this.form.value.roleId,
                email: this.form.value.email,
                password: this.form.value.password,
                confirmPassword: this.form.value.confirmPassword,
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['admin/user']);
            },
            error => {
              this.isBtnLoading = false;
              this.toastrMessageService.showInfo(error.message, "Info");
            }
          )
      }
    }
  }

  passwordMismatch(controlName: string, matchingControlName: string) {
    return () => {
      const control = this.form.controls[controlName];
      const matchingControl = this.form.controls[matchingControlName];
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ PasswordMismatch: true });
      }
      else {
        matchingControl.setErrors(null);
      }
    }

  }

}
