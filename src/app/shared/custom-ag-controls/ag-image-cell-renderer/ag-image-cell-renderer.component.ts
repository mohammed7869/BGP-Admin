import { Component } from "@angular/core";

@Component({
  selector: 'app-image-formatter-cell',
  template: `<img border="0" alt="No Image" width="50" height="50" [src]="params.value ? (params.data.itsNo | imageSecurePipe | async) : 'assets/images/noimg.png'">`
})

export class AgImageCellRendererComponent {
  params: any;
  agInit(params: any){
    this.params = params; 
  } 
}