import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams, ICellRendererComp } from 'ag-grid-community';

@Component({
  selector: 'app-ag-view-button-renderer',
  template: '<a (click)="onClick($event)" class="text-info pointer" title="View"><i class="fas fa-eye"></i></a>'
})
export class AgViewButtonRendererComponent implements AgRendererComponent, ICellRendererComp {

  cellValue: string;
  private params: any;
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
  }

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    // Optional method - no need to throw error
  }

  getGui(): HTMLElement {
    return this.element;
  }

  onClick($event: any) {
    if (this.params.onClick instanceof Function) {

      const params = {
        event: $event,
        rowData: this.params.data
      }
      this.params.onClick(params);
    }
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}