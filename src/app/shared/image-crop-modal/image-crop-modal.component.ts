import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-crop-modal',
  templateUrl: './image-crop-modal.component.html',
  styleUrls: ['./image-crop-modal.component.scss']
})
export class ImageCropModalComponent implements OnInit {
  @Input() imageFile!: File;
  @Output() imageCropped = new EventEmitter<File>();
  @Output() cancel = new EventEmitter<void>();

  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedFile: File | null = null;
  showPreview: boolean = false;

  // Cropper settings for circular crop
  cropperOptions = {
    aspectRatio: 1,
    maintainAspectRatio: true,
    resizeToWidth: 400,
    resizeToHeight: 400,
    cropperMinWidth: 100,
    cropperMinHeight: 100,
    format: 'png',
    onlyScaleDown: false,
    autoCrop: true,
    containWithinAspectRatio: true,
  };

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageChangedEvent = {
          target: {
            files: [this.imageFile],
            value: e.target.result
          }
        };
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  imageCroppedEvent(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
    // Convert base64 to File
    if (event.base64) {
      this.convertBase64ToFile(event.base64, this.imageFile.name);
    }
  }

  convertBase64ToFile(base64: string, fileName: string): void {
    try {
      const byteString = atob(base64.split(',')[1]);
      const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      // Keep original extension or use png if format changed
      const extension = fileName.includes('.') ? fileName.split('.').pop() : 'png';
      const nameWithoutExt = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
      const newFileName = `${nameWithoutExt}_cropped.${extension}`;
      this.croppedFile = new File([blob], newFileName, { type: mimeString });
    } catch (error) {
      console.error('Error converting base64 to file:', error);
    }
  }

  imageLoaded(): void {
    // Image loaded successfully
    this.showPreview = true;
  }

  cropperReady(): void {
    // Cropper is ready
  }

  loadImageFailed(): void {
    // Image load failed
    console.error('Failed to load image');
  }

  onSave(): void {
    if (this.croppedFile) {
      this.imageCropped.emit(this.croppedFile);
      this.activeModal.close(this.croppedFile);
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.activeModal.dismiss('cancel');
  }

  getCroppedImagePreview(): string {
    return this.croppedImage || '';
  }
}

