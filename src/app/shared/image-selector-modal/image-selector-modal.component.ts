import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CmsMediaService } from 'src/app/providers/services/cms-media.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-selector-modal',
  templateUrl: './image-selector-modal.component.html',
  styleUrls: ['./image-selector-modal.component.scss']
})
export class ImageSelectorModalComponent implements OnInit {
  @Input() title: string = 'Select Image';
  @Input() currentImageId: number = 0;
  @Output() imageSelected = new EventEmitter<any>();

  images: any[] = [];
  filteredImages: any[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  selectedImage: any = null;

  constructor(
    public activeModal: NgbActiveModal,
    private cmsMediaService: CmsMediaService,
    private toastrMessageService: ToastrMessageService
  ) { }

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.loading = true;
    this.cmsMediaService.getAll().subscribe(
      (data: any) => {
        this.loading = false;
        // Filter only images with supported formats
        this.images = (data || []).filter((item: any) => {
          if (item.mediaType === 'Image' || item.mediaType === 'image') {
            // Check if the image URL has a supported extension
            const url = item.url || '';
            const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            return supportedExtensions.some(ext => url.toLowerCase().includes(ext));
          }
          return false;
        });

        this.images.forEach(element => {
          element.url = environment.apiUrl + '/' + element.url;
        });

        this.filteredImages = [...this.images];

        // Set current selected image if editing
        if (this.currentImageId) {
          this.selectedImage = this.images.find(img => img.id === this.currentImageId);
        }
      },
      error => {
        this.loading = false;
        this.toastrMessageService.showError('Error loading images', 'Error');
      }
    );
  }

  filterImages(): void {
    if (!this.searchTerm.trim()) {
      this.filteredImages = [...this.images];
    } else {
      this.filteredImages = this.images.filter(img =>
        img.altText?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        img.url?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  selectImage(image: any): void {
    this.selectedImage = image;
  }

  confirmSelection(): void {
    if (this.selectedImage) {
      this.imageSelected.emit(this.selectedImage);
      this.activeModal.close(this.selectedImage);
    } else {
      this.toastrMessageService.showInfo('Please select an image', 'Info');
    }
  }

  clearSelection(): void {
    this.selectedImage = null;
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
