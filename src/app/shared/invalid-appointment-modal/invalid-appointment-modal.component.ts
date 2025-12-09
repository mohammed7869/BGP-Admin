import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invalid-appointment-modal',
  templateUrl: './invalid-appointment-modal.component.html',
  styleUrls: ['./invalid-appointment-modal.component.scss']
})
export class InvalidAppointmentModalComponent implements OnInit {

  @Input() appointment: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  confirmInvalid(): void {
    this.activeModal.close({ action: 'markInvalid', appointment: this.appointment });
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
} 