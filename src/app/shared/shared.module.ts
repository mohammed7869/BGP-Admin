import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiModule } from './ui/ui.module';
import { AgContextMenuButtonRendererComponent } from './custom-ag-controls/ag-context-menu-button-renderer/ag-context-menu-button-renderer.component';
import { AgDeleteButtonRendererComponent } from './custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { AgEditButtonRendererComponent } from './custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
import { AgPrintButtonRendererComponent } from './custom-ag-controls/ag-print-button-renderer/ag-print-button-renderer.component';
import { AgViewButtonRendererComponent } from './custom-ag-controls/ag-view-button-renderer/ag-view-button-renderer.component';
import { AgCalendarButtonRendererComponent } from './custom-ag-controls/ag-calendar-button-renderer/ag-calendar-button-renderer.component';
import { GroupByPipe } from './pipe/group-by.pipe';
import { SumPipe } from './pipe/sum.pipe';
import { AgButtonRendererComponent } from './custom-ag-controls/ag-button-renderer/ag-button-renderer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbAlertModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxBarcodeModule } from 'ngx-barcode';
import { LocalPrecisionNumberPipe } from '../providers/custom-pipe/local-precision-number.pipe';
import { AgImageCellRendererComponent } from './custom-ag-controls/ag-image-cell-renderer/ag-image-cell-renderer.component';
import { AgGridModule } from 'ag-grid-angular';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { RescheduleModalComponent } from './reschedule-modal/reschedule-modal.component';
import { ImageSecurePipePipe } from './pipe/image-secure-pipe.pipe';
import { PermissionFilterPipe } from './pipe/permission-filter.pipe';
import { AgRestoreButtonRendererComponent } from './custom-ag-controls/ag-restore-button-renderer/ag-restore-button-renderer.component';
import { GroupByParentDeptPipe } from './pipe/group-by-parent-dept.pipe';
import { SortByPropertyPipe } from './pipe/sort-by-property.pipe';
import { AgItsRefreshButtonRendererComponent } from './custom-ag-controls/ag-its-refresh-button-renderer/ag-its-refresh-button-renderer.component';
import { SafePipe } from '../providers/custom-pipe/safe.pipe';
import { InvalidAppointmentModalComponent } from './invalid-appointment-modal/invalid-appointment-modal.component';
import { CancelAppointmentModalComponent } from './cancel-appointment-modal/cancel-appointment-modal.component';
import { ArchiveAppointmentModalComponent } from './archive-appointment-modal/archive-appointment-modal.component';
import { BookAppointmentModalComponent } from './book-appointment-modal/book-appointment-modal.component';
import { UtcToLocalPipe } from './pipe/utc-to-local.pipe';
import { ImageSelectorModalComponent } from './image-selector-modal/image-selector-modal.component';
import { ImageInputComponent } from './image-input/image-input.component';
import { ImageCropModalComponent } from './image-crop-modal/image-crop-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    AgContextMenuButtonRendererComponent,
    AgDeleteButtonRendererComponent,
    AgEditButtonRendererComponent,
    AgPrintButtonRendererComponent,
    AgViewButtonRendererComponent,
    AgCalendarButtonRendererComponent,
    GroupByPipe,
    SumPipe,
    AgButtonRendererComponent,
    LocalPrecisionNumberPipe,
    AgImageCellRendererComponent,
    ConfirmationModalComponent,
    RescheduleModalComponent,
    ImageSecurePipePipe,
    PermissionFilterPipe,
    AgRestoreButtonRendererComponent,
    GroupByParentDeptPipe,
    SortByPropertyPipe,
    AgItsRefreshButtonRendererComponent,
    SafePipe,
    InvalidAppointmentModalComponent,
    CancelAppointmentModalComponent,
    ArchiveAppointmentModalComponent,
    BookAppointmentModalComponent,
    UtcToLocalPipe,
    ImageSelectorModalComponent,
    ImageInputComponent,
    ImageCropModalComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    FormsModule,
    PerfectScrollbarModule,
    NgbAlertModule,
    NgbModalModule,
    NgxBarcodeModule,
    ImageCropperModule,
    AgGridModule.withComponents([AgImageCellRendererComponent])
  ],
  providers: [
   
  ],
  exports: [
    GroupByPipe,
    SumPipe,
    LocalPrecisionNumberPipe,
    ConfirmationModalComponent,
    RescheduleModalComponent,
    ImageSecurePipePipe,
    PermissionFilterPipe,
    GroupByParentDeptPipe,
    SortByPropertyPipe,
    SafePipe,
    InvalidAppointmentModalComponent,
    CancelAppointmentModalComponent,
    ArchiveAppointmentModalComponent,
    BookAppointmentModalComponent,
    UtcToLocalPipe,
    ImageSelectorModalComponent,
    ImageInputComponent,
    ImageCropModalComponent
  ]
})
export class SharedModuleCommon { }
