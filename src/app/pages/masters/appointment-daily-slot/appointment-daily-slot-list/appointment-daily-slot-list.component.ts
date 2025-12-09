import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { appCommon } from 'src/app/common/_appCommon';
import { AppointmentDailySlotService } from 'src/app/providers/services/appointment-daily-slot.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';

@Component({
  selector: 'app-appointment-daily-slot-list',
  templateUrl: './appointment-daily-slot-list.component.html',
  styleUrls: ['./appointment-daily-slot-list.component.scss']
})

export class AppointmentDailySlotListComponent implements OnInit {
  form: FormGroup;
  columnDefs: ColDef[];
  lst: any = [];
  gridApi: any;

  isBtnLoading: boolean = false;
  isOnItEvent: boolean = false;
  submitted: boolean = false;

  public appCommon = appCommon;
  isChildRouteActive: boolean = false;
  insertSubscription: Subscription;
  updateSubscription: Subscription;
  breadcrumbTitle: String = 'List';
  pageTitle: String = 'Email Setting';
  gridHeightWidth: any = {};
  @ViewChild('printable') printable: ElementRef;
  constructor(
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private service: AppointmentDailySlotService,
    private recordCreationService: RecordCreationService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive = event.url.indexOf('masters/appointment-daily-slot/new') !== -1 || event.url.indexOf('masters/appointment-daily-slot/edit') !== -1;
        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'Appointment Daily Slot';
        }
        else {
          if (event.url.indexOf('masters/appointment-daily-slot/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Create New Appointment Daily Slot';
          }
          else if (event.url.indexOf('masters/appointment-daily-slot/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'Appointment Daily Slot Info';
          }
          else {
          }
        }
        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'Appointment Daily Slot';
        }
        else {
          if (event.url.indexOf('masters/appointment-daily-slot/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Create New Appointment Daily Slot';
          }
          else if (event.url.indexOf('masters/appointment-daily-slot/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'Appointment Daily Slot Info';
          }
          else {
          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      record => {
        if (record.table == 'Appointment Daily Slot') {
          var newRowData = {
            id: record.id,
            locationId: record.locationId,
            dayOfWeek: record.dayOfWeek,
            startTime: record.startTime,
            endTime: record.endTime,
            slotDuration: record.slotDuration
          }
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(['masters/appointment-daily-slot']);
        }
      });

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      record => {
        if (record.table == 'Appointment Daily Slot') {

          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;
              //change here only 

              newRow.locationId = record.locationId;
              newRow.dayOfWeek = record.dayOfWeek;
              newRow.startTime = record.startTime;
              newRow.endTime = record.endTime;
              newRow.slotDuration = record.slotDuration;

              //********************** */
              return newRow;
            }
          });
          this.gridApi.updateRowData({ update: [newRowData] });
          this.router.navigate(['masters/appointment-daily-slot']);
        }
      });
  }

  ngOnInit(): void {
    this.setGridHeight();
    this.createSearchForm();

    this.search();
  }

  ngAfterViewInit() {
  }



  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setGridHeight();
  }

  setGridHeight() {

    this.gridHeightWidth = {
      width: '100%',
      height: (window.innerHeight * (appCommon.GridHeightPer + 0.05)).toString() + 'px',
    };
  }

  clear() {
    this.submitted = false;
    this.createSearchForm();
    this.submitSearch();
  }

  back() {
    if (this.isChildRouteActive) {
      this.router.navigate(['admin/email-setting']);
    } else {

    }
  }

  ngOnDestroy(): void {
    this.insertSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
  }

  submitSearch() {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    }
    else {
      if (this.form.value.resultType == 1) {
        this.search();
      } else if (this.form.value.resultType == 2 || this.form.value.resultType == 3) {
        this.submitItemExportToExcel(this.form.value.resultType);
      } else if (this.form.value.resultType == 4) {
        this.generatePdf();
      } else if (this.form.value.resultType == 5) {
        this.generatePdf();
      }
    }
  }

  submitItemExportToExcel(type: number) {
    this.isBtnLoading = true;
    var fdata = this.getFilters();

    this.service.export(fdata)
      .subscribe(data => {
        if (data.size) {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(data);
          a.href = objectUrl;
          a.setAttribute("download", type == 2 ? 'applicationMasters.csv' : 'applicationMasters.xlsx');
          a.click();
          URL.revokeObjectURL(objectUrl);
        }
        else { this.toastrMessageService.showInfo('No data found to export.', 'Info'); }
        this.isBtnLoading = false;
      },
        async error => {
          this.isBtnLoading = false;
          const temp = await (new Response(error)).json();
          this.toastrMessageService.showInfo(temp.message, 'Info');
        });
  }

  generatePdf() {

  }

  search() {
    var fdata = this.getFilters();
    this.isBtnLoading = true;
    this.service.list(fdata)
      .subscribe(
        data => {
          this.isBtnLoading = false;
          this.lst = data;
        },
        error => {
          this.isBtnLoading = false;
          this.toastrMessageService.showInfo(error.error.message, "Info");
          this.lst = [];
          this.gridApi.setRowData(this.lst);
        });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;

    this.columnDefs = [
      {
        field: 'id', headerName: '', width: 42,
        cellRenderer: "editButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onEdit.bind(this)
        },
      },
      {
        field: 'id', headerName: '', width: 25,
        cellRenderer: "deleteButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onDelete.bind(this)
        },
      },
      { field: 'locationName', headerName: 'Location', width: 150, sortable: true, filter: true },
      {
        field: 'dayOfWeek', headerName: 'Day of Week', width: 150, sortable: true, filter: true,
        valueFormatter: (params: any) => {
          return appCommon.EnWeekDaysObj[params.value];
        }
      },
      { field: 'startTime', headerName: 'Start Time', width: 150, sortable: true, filter: true },
      { field: 'endTime', headerName: 'End Time', width: 150, sortable: true, filter: true },
      {
        field: 'slotDuration', headerName: 'Slot Duration', width: 150, sortable: true, filter: true,
        valueFormatter: (params: any) => {
          return params.value ? appCommon.EnTimeSlotsObj[params.value] : '';
        }
      }
    ];
  }

  frameworkComponents = {
    editButtonRendererComponent: AgEditButtonRendererComponent,
    deleteButtonRendererComponent: AgDeleteButtonRendererComponent
  };

  getFilters() {
    var obj: any = {
     
    };

    if (this.form.value.searchText) {
      obj.searchText = this.form.value.searchText;
    }

    return obj;
  }


  createSearchForm(): void {
    this.form = this.fb.group({
      searchText: [""],
      resultType: [1, [Validators.required]],
    });
  }

  onEdit(e: any) {
    this.router.navigate(['masters/appointment-daily-slot/edit/' + e.rowData.id]);
  }

  onDelete(e: any) {
    if (confirm("Are you sure want to delete record ?")) {
      this.service.delete(e.rowData.id)
        .subscribe(
          data => {
            this.toastrMessageService.showSuccess("Record deleted successfully.", "Success");
            this.lst.splice(e.rowData.index, 1);
            this.gridApi.updateRowData({ remove: [e.rowData] });
          },
          error => {
            this.toastrMessageService.showInfo(error.error.message, "Info");
          }
        )
    }
  }

  onCreate() {
    this.router.navigate(['masters/appointment-daily-slot/new']);
  }

  onBack() {
    this.router.navigate(['masters/appointment-daily-slot']);
  }
}