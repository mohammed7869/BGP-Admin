import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
    </div>
    <div class="modal-body">
      {{ message }}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" (click)="activeModal.dismiss()"><i class="ri-close-line align-middle mr-2"></i>Cancel</button>
      <button type="button" class="btn btn-sm btn-danger" (click)="activeModal.close(true)"><i class="ri-eraser-line align-middle mr-2"></i>Submit</button>
    </div>
  `
})
export class ConfirmationModalComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
