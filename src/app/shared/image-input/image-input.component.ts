import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageSelectorModalComponent } from '../image-selector-modal/image-selector-modal.component';
import { CmsMediaService } from 'src/app/providers/services/cms-media.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss']
})
export class ImageInputComponent implements OnInit {
  @Input() imageId: number = 0;
  @Input() label: string = 'Image';
  @Input() placeholder: string = 'Select an image';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Output() imageSelected = new EventEmitter<any>();
  @Output() imageCleared = new EventEmitter<void>();

  selectedImage: any = null;
  loading: boolean = false;

  constructor(
    private modalService: NgbModal,
    private cmsMediaService: CmsMediaService
  ) { }

  ngOnInit(): void {
    if (this.imageId) {
      this.loadImageDetails();
    }
  }

  ngOnChanges(): void {
    if (this.imageId && this.imageId !== 0) {
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

  clearImage(): void {
    this.selectedImage = null;
    this.imageCleared.emit();
  }

  getImageUrl(): string {
    if (this.selectedImage && this.selectedImage.url) {
      return this.selectedImage.url.startsWith('http')
        ? this.selectedImage.url
        : `${environment.apiUrl}/${this.selectedImage.url}`;
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
