import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiModule } from './ui/ui.module';
import { AgContextMenuButtonRendererComponent } from './custom-ag-controls/ag-context-menu-button-renderer/ag-context-menu-button-renderer.component';
import { AgDeleteButtonRendererComponent } from './custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { AgEditButtonRendererComponent } from './custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
import { AgPrintButtonRendererComponent } from './custom-ag-controls/ag-print-button-renderer/ag-print-button-renderer.component';
import { AgViewButtonRendererComponent } from './custom-ag-controls/ag-view-button-renderer/ag-view-button-renderer.component';
import { GroupByPipe } from './pipe/group-by.pipe';
import { SumPipe } from './pipe/sum.pipe';
import { AgButtonRendererComponent } from './custom-ag-controls/ag-button-renderer/ag-button-renderer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxBarcodeModule } from 'ngx-barcode';
import { LocalPrecisionNumberPipe } from '../providers/custom-pipe/local-precision-number.pipe';
import { AgImageCellRendererComponent } from './custom-ag-controls/ag-image-cell-renderer/ag-image-cell-renderer.component';
import { AgGridModule } from 'ag-grid-angular';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ImageSecurePipePipe } from './pipe/image-secure-pipe.pipe';
import { PermissionFilterPipe } from './pipe/permission-filter.pipe';
import { AgRestoreButtonRendererComponent } from './custom-ag-controls/ag-restore-button-renderer/ag-restore-button-renderer.component';
import { GroupByParentDeptPipe } from './pipe/group-by-parent-dept.pipe';
import { SortByPropertyPipe } from './pipe/sort-by-property.pipe';
import { AgItsRefreshButtonRendererComponent } from './custom-ag-controls/ag-its-refresh-button-renderer/ag-its-refresh-button-renderer.component';
import { SafePipe } from '../providers/custom-pipe/safe.pipe';
@NgModule({
  declarations: [
    AgContextMenuButtonRendererComponent,
    AgDeleteButtonRendererComponent,
    AgEditButtonRendererComponent,
    AgPrintButtonRendererComponent,
    AgViewButtonRendererComponent,
    GroupByPipe,
    SumPipe,
    AgButtonRendererComponent,
    LocalPrecisionNumberPipe,
    AgImageCellRendererComponent,
    ConfirmationModalComponent,
    ImageSecurePipePipe,
    PermissionFilterPipe,
    AgRestoreButtonRendererComponent,
    GroupByParentDeptPipe,
    SortByPropertyPipe,
    AgItsRefreshButtonRendererComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    FormsModule,
    PerfectScrollbarModule,
    NgbAlertModule,
    NgxBarcodeModule,
    AgGridModule.withComponents([AgImageCellRendererComponent])
  ],
  exports: [
    GroupByPipe,
    SumPipe,
    LocalPrecisionNumberPipe,
    ConfirmationModalComponent,
    ImageSecurePipePipe,
    PermissionFilterPipe,
    GroupByParentDeptPipe,
    SortByPropertyPipe,
    SafePipe
  ]
})
export class SharedModuleCommon { }
