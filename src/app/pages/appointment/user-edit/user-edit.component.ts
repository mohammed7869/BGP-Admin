import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthServiceService } from "src/app/providers/services/auth-service.service";
import { ToastrMessageService } from "src/app/providers/services/toastr-message.service";
import { RecordCreationService } from "src/app/providers/services/record-creation.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  userId: number;
  isBtnLoading: boolean = false;
  userData: any;
  selectedFile: File | null = null;
  profileImagePreview: string | null = null;
  isUploadingImage: boolean = false;
  profileImageUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthServiceService,
    private toastrMessageService: ToastrMessageService,
    private recordCreationService: RecordCreationService
  ) {
    this.userId = +this.route.snapshot.paramMap.get("id")!;
  }

  ngOnInit(): void {
    this.createForm();
    this.loadUser();
  }

  createForm(): void {
    this.userForm = this.fb.group({
      itsId: ["", Validators.required],
      fullName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      contact: [""],
      rank: [""],
      jamiyat: [""],
      jamaat: [""],
      gender: [""],
      age: [null],
      roles: [null],
    });
  }

  loadUser(): void {
    this.isBtnLoading = true;
    this.authService.getUserById(this.userId).subscribe(
      (data) => {
        this.userData = data;
        this.userForm.patchValue({
          itsId: data.itsId || "",
          fullName: data.fullName || "",
          email: data.email || "",
          contact: data.contact || "",
          rank: data.rank || "",
          jamiyat: data.jamiyat || "",
          jamaat: data.jamaat || "",
          gender: data.gender || "",
          age: data.age || null,
          roles: data.roles || null,
        });

        // Load profile image preview if exists
        if (data.profile) {
          this.profileImageUrl = data.profile;
          this.profileImagePreview = `${environment.apiUrl}/${data.profile}`;
        } else {
          this.profileImageUrl = '';
          this.profileImagePreview = null;
        }

        this.isBtnLoading = false;
      },
      (error) => {
        this.isBtnLoading = false;
        let errorMessage = "Error loading user";
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        this.toastrMessageService.showError(errorMessage, "Error");
        this.router.navigate(["appointments"]);
      }
    );
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;
    // Preview is handled by the image-input component
  }

  uploadProfileImage(): void {
    if (!this.selectedFile) {
      this.toastrMessageService.showError(
        "Please select an image file",
        "Error"
      );
      return;
    }

    this.isUploadingImage = true;
    this.authService
      .uploadUserProfileImage(this.userId, this.selectedFile)
      .subscribe(
        (data) => {
          this.isUploadingImage = false;
          this.toastrMessageService.showSuccess(
            "Profile image uploaded successfully",
            "Success"
          );
          this.selectedFile = null;

          // Update preview with new image URL
          if (data.profile) {
            this.profileImageUrl = data.profile;
            this.profileImagePreview = `${environment.apiUrl}/${data.profile}`;
            this.userData.profile = data.profile;
          }
        },
        (error) => {
          this.isUploadingImage = false;
          let errorMessage = "Error uploading image";
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          this.toastrMessageService.showError(errorMessage, "Error");
        }
      );
  }

  onImageCleared(): void {
    this.selectedFile = null;
    this.profileImageUrl = '';
    this.profileImagePreview = null;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.toastrMessageService.showError(
        "Please fill in all required fields",
        "Error"
      );
      return;
    }

    this.isBtnLoading = true;
    const formData = this.userForm.value;

    this.authService.updateUser(this.userId, formData).subscribe(
      (data) => {
        this.isBtnLoading = false;
        this.toastrMessageService.showSuccess(
          "User updated successfully",
          "Success"
        );

        // Announce the update to the list component
        var listRec = {
          table: "User",
          id: this.userId,
          itsId: formData.itsId,
          fullName: formData.fullName,
          email: formData.email,
          contact: formData.contact,
          rank: formData.rank,
          jamiyat: formData.jamiyat,
          jamaat: formData.jamaat,
          gender: formData.gender,
          age: formData.age,
          roles: formData.roles,
          profile: this.userData?.profile || null,
        };
        this.recordCreationService.announceUpdate(listRec);
        this.router.navigate(["appointments"]);
      },
      (error) => {
        this.isBtnLoading = false;
        let errorMessage = "Error updating user";
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        this.toastrMessageService.showError(errorMessage, "Error");
      }
    );
  }

  goBack(): void {
    this.router.navigate(["appointments"]);
  }

  get f() {
    return this.userForm.controls;
  }
}
