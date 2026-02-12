import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsTagService } from 'src/app/providers/services/cms-tag.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';

@Component({
  selector: 'app-cms-tag-new',
  templateUrl: './cms-tag-new.component.html',
  styleUrls: ['./cms-tag-new.component.scss']
})
export class CmsTagNewComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  isBtnLoading = false;
  recordData: any = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private service: CmsTagService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrMessageService: ToastrMessageService,
    private recordCreationService: RecordCreationService
  ) {
    this.route.data.subscribe(data => {
      console.log('Route data received:', data); // Debug log
      if (data.recordData) {
        this.recordData = data.recordData;
        console.log('Record data set:', this.recordData); // Debug log
        this.isEditMode = true;
        // Don't call populateForm here, let ngOnInit handle it
      }
    });
  }

  ngOnInit(): void {
    this.createForm();
    // If we already have recordData from constructor, populate the form
    if (this.recordData) {
      this.populateForm();
    }
    
    // Subscribe to form value changes for debugging
    this.form.valueChanges.subscribe(values => {
      console.log('Form values changed:', values);
    });
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      slug: ['', [Validators.required]]
    });
  }

  populateForm(): void {
    if (this.recordData) {
      console.log('Record Data:', this.recordData); // Debug log
      this.form.setValue({
        id: this.recordData.id || 0,
        name: this.recordData.name || '',
        slug: this.recordData.slug || ''
      });
      console.log('Form Values after setValue:', this.form.value); // Debug log
    }
  }

  generateSlug(): void {
    const name = this.form.get('name').value;
    if (name) {
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      this.form.patchValue({ slug: slug });
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.valid) {
      this.isBtnLoading = true;
      const formData = this.form.value;
      console.log('Form Data being submitted:', formData); // Debug log

      if (this.isEditMode) {
        this.service.update(formData).subscribe(
          response => {
            this.isBtnLoading = false;
            this.toastrMessageService.showSuccess('CMS tag updated successfully', 'Success');
            
            // Notify record creation service
            this.recordCreationService.announceUpdate({
              table: 'CMS Tag',
              id: formData.id,
              name: formData.name,
              slug: formData.slug,
              modifiedDate: new Date()
            });

            this.router.navigate(['cms-tag']);
          },
          error => {
            this.isBtnLoading = false;
            this.toastrMessageService.showError(error.error.message || 'Error updating CMS tag', 'Error');
          }
        );
      } else {
        this.service.create(formData).subscribe(
          response => {
            this.isBtnLoading = false;
            this.toastrMessageService.showSuccess('CMS tag created successfully', 'Success');
            
            // Notify record creation service
            this.recordCreationService.announceInsert({
              table: 'CMS Tag',
              id: response,
              name: formData.name,
              slug: formData.slug,
              createdDate: new Date()
            });

            this.router.navigate(['cms-tag']);
          },
          error => {
            this.isBtnLoading = false;
            this.toastrMessageService.showError(error.error.message || 'Error creating CMS tag', 'Error');
          }
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['cms-tag']);
  }

  // Debug method to test form population
  testFormPopulation(): void {
    console.log('Current form values:', this.form.value);
    console.log('Current record data:', this.recordData);
    console.log('Is edit mode:', this.isEditMode);
  }
}
