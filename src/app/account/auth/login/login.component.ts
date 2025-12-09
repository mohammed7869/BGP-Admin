import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/providers/services/local-storage.service';
import { appCommon } from 'src/app/common/_appCommon';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { environment } from 'src/environments/environment';
import { TenantConfigService } from 'src/app/core/services/tenant-config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = '';
  isBtnLoading: boolean = false;
  fieldTextType!: boolean;
  year: number = new Date().getFullYear();
  userLoginData: any;
  isUserRemembered: boolean = false;

  @ViewChild('shortcode') shortcode: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('password') password: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthServiceService,
    private localStorageServiceService: LocalStorageService,
    private toastrMessageService: ToastrMessageService,
    public tenantConfigService: TenantConfigService
  ) {
    var userLoginData = this.localStorageServiceService.getItem(appCommon.LocalStorageKeyType.UserLoginDetail);
    if (userLoginData && Object.keys(userLoginData).length > 0) {
      this.userLoginData = userLoginData;
      this.isUserRemembered = !!this.userLoginData?.userLoginName;
    }
  }

  ngOnInit() {
    document.body.removeAttribute('data-layout');
    document.body.classList.add('auth-body-bg');
    this.createLoginForm();
  }

  createLoginForm() {
    // Check if tenant is configured via URL
    const isTenantConfigured = this.tenantConfigService.isTenantConfigured();
    const defaultCompanyCode = isTenantConfigured
      ? this.tenantConfigService.getCompanyCode()
      : (this.userLoginData?.companyShortCode || environment.companyName || '');

    this.loginForm = this.formBuilder.group({
      email: [this.userLoginData?.userLoginName || environment.userName || '', Validators.required],
      password: [environment.password || null, Validators.required],
      shortcode: [defaultCompanyCode, Validators.required],
    });

    if (this.isUserRemembered) {
      this.loginForm.get('email')?.disable();
      this.loginForm.get('shortcode')?.disable();
      this.focusOnPassword();
    } else {
      // If tenant is configured via URL, disable company code field
      if (isTenantConfigured) {
        this.loginForm.get('shortcode')?.disable();
        this.focusOnEmail();
      } else {
        this.focusOnShortcode();
      }
    }
  }

  onNotYouClick() {
    this.isUserRemembered = false;
    this.localStorageServiceService.removeItem(appCommon.LocalStorageKeyType.UserLoginDetail);
    this.userLoginData = null;
    
    // Recreate the form with proper tenant configuration
    this.createLoginForm();
  }
  get f() { return this.loginForm.controls; }

  onAdminSubmit() {

    if (this.loginForm.invalid) {
      this.error = "Username and Password not valid !";
      return;
    }
    else {
      this.isBtnLoading = true;
      this.submitted = true;

      this.authService.adminLogin(this.f.email.value,
        this.f.password.value, this.f.shortcode.value)
        .subscribe(
          data => {
            this.toastrMessageService.showSuccess("Login Successful", 'Success');
            this.router.navigate(["appointments"]);
          },
          error => {
            this.error = error.message;
            this.submitted = false;
            this.isBtnLoading = false;
          }
        )
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  focusOnShortcode() {
    setTimeout(() => this.shortcode?.nativeElement?.focus(), 50);
  }

  focusOnPassword() {
    setTimeout(() => this.password?.nativeElement?.focus(), 50);
  }

  focusOnEmail() {
    setTimeout(() => this.email?.nativeElement?.focus(), 50);
  }
}