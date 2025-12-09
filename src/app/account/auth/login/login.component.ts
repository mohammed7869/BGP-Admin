import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LocalStorageService } from "src/app/providers/services/local-storage.service";
import { appCommon } from "src/app/common/_appCommon";
import { AuthServiceService } from "src/app/providers/services/auth-service.service";
import { ToastrMessageService } from "src/app/providers/services/toastr-message.service";
import { environment } from "src/environments/environment";
import { TenantConfigService } from "src/app/core/services/tenant-config.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = "";
  isBtnLoading: boolean = false;
  fieldTextType!: boolean;
  year: number = new Date().getFullYear();
  userLoginData: any;
  isUserRemembered: boolean = false;

  @ViewChild("email") email: ElementRef;
  @ViewChild("password") password: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthServiceService,
    private localStorageServiceService: LocalStorageService,
    private toastrMessageService: ToastrMessageService,
    public tenantConfigService: TenantConfigService
  ) {
    var userLoginData = this.localStorageServiceService.getItem(
      appCommon.LocalStorageKeyType.UserLoginDetail
    );
    if (userLoginData && Object.keys(userLoginData).length > 0) {
      this.userLoginData = userLoginData;
      this.isUserRemembered = !!this.userLoginData?.userLoginName;
    }
  }

  ngOnInit() {
    document.body.removeAttribute("data-layout");
    document.body.classList.add("auth-body-bg");
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        this.userLoginData?.userLoginName || environment.userName || "",
        Validators.required,
      ],
      password: [environment.password || null, Validators.required],
    });

    if (this.isUserRemembered) {
      this.loginForm.get("email")?.disable();
      this.focusOnPassword();
    } else {
      this.focusOnEmail();
    }
  }

  onNotYouClick() {
    this.isUserRemembered = false;
    this.localStorageServiceService.removeItem(
      appCommon.LocalStorageKeyType.UserLoginDetail
    );
    this.userLoginData = null;

    // Recreate the form with proper tenant configuration
    this.createLoginForm();
  }
  get f() {
    return this.loginForm.controls;
  }

  onAdminSubmit() {
    if (this.loginForm.invalid) {
      this.error = "Email and Password are required!";
      return;
    } else {
      this.isBtnLoading = true;
      this.submitted = true;

      this.authService
        .adminLogin(this.f.email.value, this.f.password.value)
        .subscribe(
          (data) => {
            this.toastrMessageService.showSuccess(
              "Login Successful",
              "Success"
            );
            this.router.navigate(["appointments"]);
          },
          (error) => {
            this.error =
              error?.error?.message ||
              error?.message ||
              "Login failed. Please check your credentials.";
            this.submitted = false;
            this.isBtnLoading = false;
          }
        );
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  focusOnPassword() {
    setTimeout(() => this.password?.nativeElement?.focus(), 50);
  }

  focusOnEmail() {
    setTimeout(() => this.email?.nativeElement?.focus(), 50);
  }

  navigateToBaawan() {
    window.open("https://www.baawanerp.com/", "_blank");
  }
  navigateToBaawanCMS() {
    window.open("https://baawan.com/", "_blank");
  }
}
