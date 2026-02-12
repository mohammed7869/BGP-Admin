import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { appCommon } from "src/app/common/_appCommon";
import { ActivatedRoute, Router } from "@angular/router";
import { CmsPageService } from "src/app/providers/services/cms-page.service";
import { RecordCreationService } from "src/app/providers/services/record-creation.service";
import { ToastrMessageService } from "src/app/providers/services/toastr-message.service";

import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  selector: "app-cms-page-new",
  templateUrl: "./cms-page-new.component.html",
  styleUrls: ["./cms-page-new.component.scss"],
})
export class CmsPageNewComponent implements OnInit {
  form: FormGroup;
  public appCommon = appCommon;
  submitLoading: boolean = false;
  recordData: any = null;
  submitted: boolean = false;
  public Editor = ClassicEditor;
  pageTitle: String = "Create New CMS Page";

  constructor(
    private fb: FormBuilder,
    private toastrMessageService: ToastrMessageService,
    private location: Location,
    private router: Router,
    private service: CmsPageService,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService
  ) {}

  ngOnInit(): void {
    this.createForm();

    if (this.route.snapshot.data["recordData"])
      this.recordData = this.route.snapshot.data["recordData"];
    if (this.recordData) {
      this.setFormValues();
      this.pageTitle = "Edit CMS Page";
      // Load existing page blogs if any
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      name: ["", [Validators.required]],
      slug: ["", [Validators.required]],
      title: ["", [Validators.required]],
      heading: ["", [Validators.required]],
      shortDesc: [""],
      longDesc: [""],
      pageImageId: [0],
      backgroundImageId: [0],
      language: [1, [Validators.required]],
      isLandingPage: [false],
      isDraft: [true],
      isHomePage: [false],
      version: [1],
      isPublished: [false],
      publishDate: [this.formatDateForInput(new Date())],
      expiryDate: [""],
    });
  }

  setFormValues(): void {
    this.form.patchValue({
      id: this.recordData.id,
      name: this.recordData.name,
      slug: this.recordData.slug,
      title: this.recordData.title,
      heading: this.recordData.heading,
      shortDesc: this.recordData.shortDesc || "",
      longDesc: this.recordData.longDesc || "",
      pageImageId: this.recordData.pageImageId || 0,
      backgroundImageId: this.recordData.backgroundImageId || 0,
      language: this.recordData.language || 1,
      isLandingPage: this.recordData.isLandingPage || false,
      isDraft:
        this.recordData.isDraft !== undefined ? this.recordData.isDraft : true,
      isHomePage: this.recordData.isHomePage || false,
      version: this.recordData.version || 1,
      isPublished: this.recordData.isPublished || false,
      publishDate: this.recordData.publishDate
        ? this.formatDateForInput(new Date(this.recordData.publishDate))
        : this.formatDateForInput(new Date()),
      expiryDate: this.recordData.expiryDate
        ? this.formatDateForInput(new Date(this.recordData.expiryDate))
        : "",
    });
  }

  onPageImageSelected(image: any): void {
    if (image) {
      this.form.patchValue({ pageImageId: image.id });
    }
  }

  onPageImageCleared(): void {
    this.form.patchValue({ pageImageId: 0 });
  }

  onBackgroundImageSelected(image: any): void {
    if (image) {
      this.form.patchValue({ backgroundImageId: image.id });
    }
  }

  onBackgroundImageCleared(): void {
    this.form.patchValue({ backgroundImageId: 0 });
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    } else {
      this.submitLoading = true;
      var fdata = this.form.value;

      // Convert datetime-local to ISO string for API
      if (fdata.publishDate) {
        fdata.publishDate = new Date(fdata.publishDate).toISOString();
      }
      if (fdata.expiryDate) {
        fdata.expiryDate = new Date(fdata.expiryDate).toISOString();
      }

      if (fdata.id) {
        // Update existing record
        this.service.update(fdata).subscribe({
          next: (response: any) => {
            this.submitLoading = false;
            this.toastrMessageService.showSuccess(
              "CMS page updated successfully",
              "Success"
            );
            this.recordCreationService.announceUpdate({
              table: "CMS Page",
              id: fdata.id,
              name: fdata.name,
              slug: fdata.slug,
              title: fdata.title,
              heading: fdata.heading,
              isPublished: fdata.isPublished,
              isDraft: fdata.isDraft,
              isHomePage: fdata.isHomePage,
              isLandingPage: fdata.isLandingPage,
              publishDate: fdata.publishDate,
              modifiedDate: new Date().toISOString(),
            });
            this.router.navigate(["cms-media/page"]);
          },
          error: (error: any) => {
            this.submitLoading = false;
            console.error("Error updating CMS page:", error);
            this.toastrMessageService.showError(
              "Error updating CMS page. Please try again.",
              "Error"
            );
          },
        });
      } else {
        // Create new record with FormData
        const formData = this.convertToFormData(fdata);
        this.service.createWithFormData(formData).subscribe({
          next: (response: any) => {
            this.submitLoading = false;
            this.toastrMessageService.showSuccess(
              "CMS page created successfully",
              "Success"
            );
            this.recordCreationService.announceInsert({
              table: "CMS Page",
              id: response.id || response.data?.id,
              name: fdata.name,
              slug: fdata.slug,
              title: fdata.title,
              heading: fdata.heading,
              isPublished: fdata.isPublished,
              isDraft: fdata.isDraft,
              isHomePage: fdata.isHomePage,
              isLandingPage: fdata.isLandingPage,
              publishDate: fdata.publishDate,
              createdDate: new Date().toISOString(),
            });
            this.router.navigate(["cms-page"]);
          },
          error: (error: any) => {
            this.submitLoading = false;
            console.error("Error creating CMS page:", error);
            this.toastrMessageService.showError(
              "Error creating CMS page. Please try again.",
              "Error"
            );
          },
        });
      }
    }
  }

  onBack(): void {
    this.location.back();
  }

  onCancel(): void {
    this.router.navigate(["cms-media/page"]);
  }

  convertToFormData(data: any): FormData {
    const formData = new FormData();

    // Add all form fields to FormData
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    return formData;
  }
}
