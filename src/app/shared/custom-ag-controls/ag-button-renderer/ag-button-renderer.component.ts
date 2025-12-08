import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-ag-button-renderer',
  template: `<button (click)="onClick($event)" class="btn btn-sm h-75 {{class}}"><small><i class="{{icon}} align-middle mr-1"></i>{{label}}</small></button>`
})
export class AgButtonRendererComponent implements ICellRendererAngularComp {
  public params: any;
  public label: string;
  public class: string
  public icon: string
  cellValue: string;

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.params = params;
    this.label = this.params.label || '';
    this.class = this.params.class;
    this.icon = this.params.icon;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
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

