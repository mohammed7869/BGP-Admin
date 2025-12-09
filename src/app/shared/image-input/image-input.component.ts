import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageSelectorModalComponent } from '../image-selector-modal/image-selector-modal.component';
import { CmsMediaService } from 'src/app/providers/services/cms-media.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss']
})
export class ImageInputComponent implements OnInit, OnChanges {
  @Input() imageId: number = 0;
  @Input() label: string = 'Image';
  @Input() placeholder: string = 'Select an image';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() allowFileUpload: boolean = false;
  @Input() imageUrl: string = '';
  @Input() accept: string = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
  @Output() imageSelected = new EventEmitter<any>();
  @Output() imageCleared = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();

  selectedImage: any = null;
  selectedFile: File | null = null;
  loading: boolean = false;

  constructor(
    private modalService: NgbModal,
    private cmsMediaService: CmsMediaService
  ) { }

  ngOnInit(): void {
    if (this.allowFileUpload && this.imageUrl) {
      // For file upload mode, set image from URL
      this.selectedImage = { url: this.imageUrl };
    } else if (this.imageId) {
      this.loadImageDetails();
    }
  }

  ngOnChanges(): void {
    if (this.allowFileUpload && this.imageUrl) {
      // For file upload mode, set image from URL
      this.selectedImage = { url: this.imageUrl };
    } else if (this.imageId && this.imageId !== 0) {
      this.loadImageDetails();
    } else {
      this.selectedImage = null;
    }
  }

  loadImageDetails(): void {
    if (!this.imageId) return;

    this.loading = true;
    this.cmsMediaService.getById(this.imageId).subscribe(
      (data: any) => {
        this.loading = false;
        if (data) {
          // Ensure full URL for preview
          const fullUrl = data.url ? (data.url.startsWith('http') ? data.url : `${environment.apiUrl}/${data.url}`) : '';
          this.selectedImage = { ...data, url: fullUrl };
        } else {
          this.selectedImage = null;
        }
      },
      _error => {
        this.loading = false;
        this.selectedImage = null;
      }
    );
  }

  openImageSelector(): void {
    if (this.disabled) return;

    if (this.allowFileUpload) {
      // For file upload mode, trigger file input
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = this.accept;
      fileInput.style.display = 'none';
      fileInput.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          this.handleFileSelection(file);
        }
        document.body.removeChild(fileInput);
      };
      document.body.appendChild(fileInput);
      fileInput.click();
    } else {
      // Original behavior: open modal to select from CMS media
      const modalRef = this.modalService.open(ImageSelectorModalComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      });

      modalRef.componentInstance.title = `Select ${this.label}`;
      modalRef.componentInstance.currentImageId = this.imageId;

      modalRef.componentInstance.imageSelected.subscribe((image: any) => {
        this.selectedImage = image;
        this.imageSelected.emit(image);
      });
    }
  }

  handleFileSelection(file: File): void {
    // Validate file type
    const allowedTypes = this.accept.split(',').map(t => t.trim());
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    this.selectedFile = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = { url: e.target.result, altText: file.name };
      this.fileSelected.emit(file);
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.selectedImage = null;
    this.selectedFile = null;
    this.imageCleared.emit();
  }

  getImageUrl(): string {
    if (this.selectedImage && this.selectedImage.url) {
      // If it's a data URL (from file upload), return as is
      if (this.selectedImage.url.startsWith('data:')) {
        return this.selectedImage.url;
      }
      // If it's already a full URL, return as is
      if (this.selectedImage.url.startsWith('http')) {
        return this.selectedImage.url;
      }
      // Otherwise, prepend API URL
      return `${environment.apiUrl}/${this.selectedImage.url}`;
    }
    // Return a simple placeholder SVG data URI
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0NyA4OC4wMDAxIDgxIDk4IDgxQzEwNy45OTkgODEgMTE2IDg5LjU0NDcgMTE2IDEwMEMxMTYgMTEwLjQ1NSAxMDcuOTk5IDExOSA5OCAxMTlDODguMDAwMSAxMTkgODAgMTEwLjQ1NSA4MCAxMDBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzExMC40NTUgMTMwIDExOSAxMjEuNDU1IDExOSAxMTFDMTE5IDEwMC41NDUgMTEwLjQ1NSA5MiAxMDAgOTJDODkuNTQ0NyA5MiA4MSAxMDAuNTQ1IDgxIDExMUM4MSAxMjEuNDU1IDg5LjU0NDcgMTMwIDEwMCAxMzBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0xMjAgMTAwQzEyMCA4OS41NDQ3IDEyOC4wMDAxIDgxIDEzOCA4MUMxNDcuOTk5IDgxIDE1NiA4OS41NDQ3IDE1NiAxMDBDMTU2IDExMC40NTUgMTQ3Ljk5OSAxMTkgMTM4IDExOUMxMjguMDAwMSAxMTkgMTIwIDExMC40NTUgMTIwIDEwMFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+';
  }

  getImageAlt(): string {
    if (this.selectedImage && this.selectedImage.altText) {
      return this.selectedImage.altText;
    }
    return this.label;
  }
}
