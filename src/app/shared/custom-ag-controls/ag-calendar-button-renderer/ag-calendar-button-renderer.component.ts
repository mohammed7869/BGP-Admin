import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-ag-calendar-button-renderer',
  template: `
    <button 
      type="button" 
      class="btn btn-info btn-sm" 
      (click)="onClick($event)"
      title="Add to Google Calendar">
      <i class="fa fa-calendar"></i>
    </button>
  `,
  // styles: [`
  //   .btn-info {
  //     background-color: #17a2b8;
  //     border-color: #17a2b8;
  //     color: white;
  //   }
  //   .btn-info:hover {
  //     background-color: #138496;
  //     border-color: #117a8b;
  //     color: white;
  //   }
  // `]
})
export class AgCalendarButtonRendererComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onClick(event: any): void {
    if (this.params.onClick) {
      this.params.onClick(this.params.data);
    }
  }
}