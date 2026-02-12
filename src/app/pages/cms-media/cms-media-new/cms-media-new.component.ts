import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appCommon } from 'src/app/common/_appCommon';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsMediaService } from 'src/app/providers/services/cms-media.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cms-media-new',
  templateUrl: './cms-media-new.component.html',
  styleUrls: ['./cms-media-new.component.scss']
})
export class CmsMediaNewComponent implements OnInit {

  form: FormGroup;
  public appCommon = appCommon;
  submitLoading: boolean = false;
  recordData: any = null;
  submitted: boolean = false;
  selectedFile: File | null = null;
  pageTitle: String = 'Create New CMS Media';

  constructor(
    private fb: FormBuilder,
    private toastrMessageService: ToastrMessageService,
    private location: Location,
    private router: Router,
    private service: CmsMediaService,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService) { }

  ngOnInit(): void {
    this.createForm();

    if (this.route.snapshot.data['recordData'])
      this.recordData = this.route.snapshot.data['recordData'];
    if (this.recordData) {
      this.setFormValues();
      // For edit mode, we need to ensure we have a file
      if (this.recordData.mediaFile) {
        this.selectedFile = this.recordData.mediaFile;
      }
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      url: ['www.google.com'],
      mediaFile: [null], // Not required initially
      altText: [''],
      mediaType: ['Image', [Validators.required]],
      isPublicMedia: [true]
    })
  }

  setFormValues(): void {
    this.form.patchValue({
      id: this.recordData.id,
      url: this.recordData.url,
      altText: this.recordData.altText || '',
      mediaType: this.recordData.mediaType,
      isPublicMedia: this.recordData.isPublicMedia !== undefined ? this.recordData.isPublicMedia : true
    });

    // Set page title for edit mode
    this.pageTitle = 'Edit CMS Media';
    
    // In edit mode, only allow alt text changes
    if (this.recordData) {
      this.form.get('mediaType').disable();
      this.form.get('isPublicMedia').disable();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type based on current mediaType
      const mediaType = this.form.get('mediaType').value;
      if (mediaType) {
        const isValid = this.validateFileType(file, mediaType);
        if (isValid) {
          this.selectedFile = file;
          this.form.patchValue({ mediaFile: file });
        }
      } else {
        // If no media type selected, show error
        this.toastrMessageService.showError('Please select a media type first', 'Media Type Required');
        this.clearSelectedFile();
      }
    }
  }

  clearSelectedFile(): void {
    this.selectedFile = null;
    this.form.patchValue({ mediaFile: null });
    const fileInput = document.getElementById('mediaFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  validateFileType(file: File, mediaType: string): boolean {
    let isValid = false;

    switch (mediaType) {
      case this.appCommon.EnMediaTypeObj.Image:
        isValid = this.isValidImageFile(file);
        break;
      case this.appCommon.EnMediaTypeObj.Video:
        isValid = this.isValidVideoFile(file);
        break;
      case this.appCommon.EnMediaTypeObj.Document:
        isValid = this.isValidDocumentFile(file);
        break;
      default:
        isValid = false;
    }

    if (!isValid) {
      this.toastrMessageService.showError(`Selected file type does not match the media type "${mediaType}". Please select a valid ${mediaType.toLowerCase()} file.`, 'File Type Error');
      this.selectedFile = null;
      this.form.patchValue({ mediaFile: null });
      // Reset file input
      const fileInput = document.getElementById('mediaInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }

    return isValid;
  }

  isValidImageFile(file: File): boolean {
    const validImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
    return validImageTypes.includes(file.type);
  }

  isValidVideoFile(file: File): boolean {
    const validVideoTypes = [
      'video/mp4',
      'video/avi',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv'
    ];
    return validVideoTypes.includes(file.type);
  }

  isValidDocumentFile(file: File): boolean {
    const validDocumentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv'
    ];
    return validDocumentTypes.includes(file.type);
  }

  getAcceptFileTypes(): string {
    const mediaType = this.form.get('mediaType').value;

    switch (mediaType) {
      case this.appCommon.EnMediaTypeObj.Image:
        return '.jpg,.jpeg,.png,.gif,.webp,image/*';
      case this.appCommon.EnMediaTypeObj.Video:
        return '.mp4,.avi,.mov,.wmv,video/*';
      case this.appCommon.EnMediaTypeObj.Document:
        return '.pdf,.doc,.docx,.txt,.csv';
      default:
        return '*/*';
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    } else {
      this.submitLoading = true;
      var fdata = this.form.value;

      // For create we use FormData (file upload); for update we send JSON
      if (!fdata.id) {
        // Create mode - require all fields
        if (!this.selectedFile) {
          this.toastrMessageService.showError('Media file is required', 'Validation Error');
          this.submitLoading = false;
          return;
        }
        
        const formData = new FormData();
        formData.append('url', fdata.url);
        formData.append('altText', fdata.altText || '');
        formData.append('mediaType', fdata.mediaType);
        formData.append('isPublicMedia', fdata.isPublicMedia);
        formData.append('mediaFile', this.selectedFile);
        // Create new record
        this.service.create(formData)
          .subscribe(
            data => {
              this.submitLoading = false;
              this.toastrMessageService.showSuccess("New CMS media created successfully", "Success");
              var listRec = {
                table: 'CMS Media',
                id: data,
                url: this.form.value.url,
                altText: this.form.value.altText,
                mediaType: this.form.value.mediaType,
                createdDate: new Date().toISOString(),
                createdBy: 'Current User'
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['cms-media']);
            },
            error => {
              this.submitLoading = false;
              this.toastrMessageService.showError(error.error.message || 'Error creating CMS media', 'Error');
            }
          )
      } else {
        // Update existing record with JSON payload
        const payload = {
          id: fdata.id,
          altText: fdata.altText || ''
        };
        this.service.update(payload)
          .subscribe(
            data => {
              this.submitLoading = false;
              this.toastrMessageService.showSuccess("CMS media updated successfully.", "Success");
              var listRec = {
                table: 'CMS Media',
                id: this.form.value.id,
                url: this.form.value.url,
                altText: this.form.value.altText,
                mediaType: this.form.value.mediaType,
                modifiedDate: new Date().toISOString(),
                modifiedBy: 'Current User'
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['cms-media']);
            },
            error => {
              this.submitLoading = false;
              this.toastrMessageService.showError(error.error.message || 'Error updating CMS media', 'Error');
            }
          )
      }
    }
  }

  onCancel(): void {
    this.location.back();
  }

  onBack(): void {
    this.location.back();
  }

  validateMediaType(): void {
    const mediaType = this.form.get('mediaType').value;
    const validTypes = this.appCommon.EnMediaType.map(type => type.id);

    if (mediaType && !validTypes.includes(mediaType)) {
      this.form.get('mediaType').setErrors({ invalidMediaType: true });
    } else {
      this.form.get('mediaType').setErrors(null);

      // Clear selected file when media type changes to ensure compatibility
      if (this.selectedFile) {
        const isValidForNewType = this.validateFileType(this.selectedFile, mediaType);
        if (!isValidForNewType) {
          this.clearSelectedFile();
          this.toastrMessageService.showInfo(`File cleared because it's not compatible with the new media type "${mediaType}"`, 'File Compatibility');
        }
      }
    }
  }

  getMediaPreviewUrl(): string {
    if (this.recordData && this.recordData.url) {
      return environment.apiUrl + '/' + encodeURI(this.recordData.url);
    }
    return '';
  }

  getVideoMimeType(): string {
    if (this.recordData && this.recordData.url) {
      const url = this.recordData.url.toLowerCase();
      if (url.includes('.mp4')) return 'video/mp4';
      if (url.includes('.avi')) return 'video/avi';
      if (url.includes('.mov')) return 'video/quicktime';
      if (url.includes('.wmv')) return 'video/x-ms-wmv';
    }
    return 'video/mp4'; // default
  }

  getFileNameFromUrl(url: string): string {
    if (url) {
      const parts = url.split('/');
      const name = parts[parts.length - 1] || url;
      try { return decodeURIComponent(name); } catch { return name; }
    }
    return 'Unknown file';
  }

  /** Get full featured image URL from a post or record object */
  getFeaturedImageFullUrl(post: any): string | undefined {
    if (post?.featuredImageUrl) {
      return environment.apiUrl + '/' + post.featuredImageUrl;
    }
    return undefined;
  }

  /** Get full author image URL from a post or record object; returns undefined if null */
  getAuthorImageFullUrl(post: any): string | undefined {
    if (post?.authorImageUrl) {
      return environment.apiUrl + '/' + post.authorImageUrl;
    }
    return undefined;
  }
}
