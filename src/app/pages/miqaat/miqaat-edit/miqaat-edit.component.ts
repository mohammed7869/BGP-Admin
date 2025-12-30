import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MiqaatService } from "src/app/providers/services/miqaat.service";
import { ToastrMessageService } from "src/app/providers/services/toastr-message.service";
import { RecordCreationService } from "src/app/providers/services/record-creation.service";
import * as moment from "moment";

@Component({
  selector: "app-miqaat-edit",
  templateUrl: "./miqaat-edit.component.html",
  styleUrls: ["./miqaat-edit.component.scss"],
})
export class MiqaatEditComponent implements OnInit {
  miqaatForm: FormGroup;
  miqaatId: number;
  isBtnLoading: boolean = false;
  miqaatData: any;
  moment = moment; // Make moment available in template

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private miqaatService: MiqaatService,
    private toastrMessageService: ToastrMessageService,
    private recordCreationService: RecordCreationService
  ) {
    this.miqaatId = +this.route.snapshot.paramMap.get("id")!;
  }

  ngOnInit(): void {
    this.createForm();
    this.loadMiqaat();
  }

  createForm(): void {
    this.miqaatForm = this.fb.group({
      miqaatName: ["", Validators.required],
      jamaat: ["", Validators.required],
      jamiyat: ["", Validators.required],
      fromDate: ["", Validators.required],
      tillDate: ["", Validators.required],
      volunteerLimit: [null, [Validators.required, Validators.min(1)]],
      aboutMiqaat: [""],
      adminApproval: [""],
    });
  }

  loadMiqaat(): void {
    this.isBtnLoading = true;
    this.miqaatService.getById(this.miqaatId).subscribe(
      (data) => {
        this.miqaatData = data;
        
        // Format dates for input fields (YYYY-MM-DD format)
        const fromDate = data.fromDate 
          ? moment(data.fromDate).format("YYYY-MM-DD")
          : "";
        const tillDate = data.tillDate
          ? moment(data.tillDate).format("YYYY-MM-DD")
          : "";

        this.miqaatForm.patchValue({
          miqaatName: data.miqaatName || "",
          jamaat: data.jamaat || "",
          jamiyat: data.jamiyat || "",
          fromDate: fromDate,
          tillDate: tillDate,
          volunteerLimit: data.volunteerLimit || null,
          aboutMiqaat: data.aboutMiqaat || "",
          adminApproval: data.adminApproval || "Pending",
        });

        this.isBtnLoading = false;
      },
      (error) => {
        this.isBtnLoading = false;
        let errorMessage = "Error loading miqaat";
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        this.toastrMessageService.showError(errorMessage, "Error");
        this.router.navigate(["miqaats"]);
      }
    );
  }

  onSubmit(): void {
    if (this.miqaatForm.invalid) {
      this.miqaatForm.markAllAsTouched();
      this.toastrMessageService.showError(
        "Please fill in all required fields",
        "Error"
      );
      return;
    }

    // Validate dates
    const fromDate = new Date(this.miqaatForm.value.fromDate);
    const tillDate = new Date(this.miqaatForm.value.tillDate);

    if (tillDate < fromDate) {
      this.toastrMessageService.showError(
        "Till date must be after From date",
        "Error"
      );
      return;
    }

    this.isBtnLoading = true;
    const formData = {
      miqaatName: this.miqaatForm.value.miqaatName,
      jamaat: this.miqaatForm.value.jamaat,
      jamiyat: this.miqaatForm.value.jamiyat,
      fromDate: fromDate.toISOString(),
      tillDate: tillDate.toISOString(),
      volunteerLimit: this.miqaatForm.value.volunteerLimit,
      aboutMiqaat: this.miqaatForm.value.aboutMiqaat || null,
      adminApproval: this.miqaatForm.value.adminApproval || null,
    };

    this.miqaatService.update(this.miqaatId, formData).subscribe(
      (data) => {
        this.isBtnLoading = false;
        this.toastrMessageService.showSuccess(
          "Miqaat updated successfully",
          "Success"
        );

        // Announce the update to the list component
        var listRec = {
          table: "Miqaat",
          id: this.miqaatId,
          miqaatName: formData.miqaatName,
          jamaat: formData.jamaat,
          jamiyat: formData.jamiyat,
          fromDate: formData.fromDate,
          tillDate: formData.tillDate,
          volunteerLimit: formData.volunteerLimit,
          aboutMiqaat: formData.aboutMiqaat,
          adminApproval: this.miqaatData?.adminApproval || "Pending",
          captainName: this.miqaatData?.captainName || "",
        };
        this.recordCreationService.announceUpdate(listRec);
        this.router.navigate(["miqaats"]);
      },
      (error) => {
        this.isBtnLoading = false;
        let errorMessage = "Error updating miqaat";
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
    this.router.navigate(["miqaats"]);
  }

  onApprove(): void {
    if (
      confirm(
        `Are you sure you want to approve miqaat "${this.miqaatData?.miqaatName || 'this miqaat'}"?`
      )
    ) {
      this.isBtnLoading = true;
      this.miqaatService
        .updateApprovalStatus(this.miqaatId, "Approved")
        .subscribe(
          (data) => {
            this.isBtnLoading = false;
            this.toastrMessageService.showSuccess(
              "Miqaat approved successfully",
              "Success"
            );
            // Update local data and form
            if (this.miqaatData) {
              this.miqaatData.adminApproval = "Approved";
            }
            this.miqaatForm.patchValue({ adminApproval: "Approved" });
            // Reload miqaat data to get updated information
            this.loadMiqaat();
          },
          (error) => {
            this.isBtnLoading = false;
            let errorMessage = "Error approving miqaat";
            if (error?.error?.message) {
              errorMessage = error.error.message;
            } else if (error?.message) {
              errorMessage = error.message;
            }
            this.toastrMessageService.showError(errorMessage, "Error");
          }
        );
    }
  }

  onReject(): void {
    if (
      confirm(
        `Are you sure you want to reject miqaat "${this.miqaatData?.miqaatName || 'this miqaat'}"?`
      )
    ) {
      this.isBtnLoading = true;
      this.miqaatService
        .updateApprovalStatus(this.miqaatId, "Rejected")
        .subscribe(
          (data) => {
            this.isBtnLoading = false;
            this.toastrMessageService.showSuccess(
              "Miqaat rejected successfully",
              "Success"
            );
            // Update local data and form
            if (this.miqaatData) {
              this.miqaatData.adminApproval = "Rejected";
            }
            this.miqaatForm.patchValue({ adminApproval: "Rejected" });
            // Reload miqaat data to get updated information
            this.loadMiqaat();
          },
          (error) => {
            this.isBtnLoading = false;
            let errorMessage = "Error rejecting miqaat";
            if (error?.error?.message) {
              errorMessage = error.error.message;
            } else if (error?.message) {
              errorMessage = error.message;
            }
            this.toastrMessageService.showError(errorMessage, "Error");
          }
        );
    }
  }

  get f() {
    return this.miqaatForm.controls;
  }
}

