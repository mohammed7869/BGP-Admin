import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { appCommon } from 'src/app/common/_appCommon';
import { ErrorUtils } from 'src/app/common/error-utils';
import { AppointmentDailySlotService } from 'src/app/providers/services/appointment-daily-slot.service';
import { AppointmentLocationService } from 'src/app/providers/services/appointment-location.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';

@Component({
  selector: 'app-appointment-location-list',
  templateUrl: './appointment-location-list.component.html',
  styleUrls: ['./appointment-location-list.component.scss']
})

export class AppointmentLocationListComponent implements OnInit {
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
  pageTitle: String = 'Appointment Location';
  gridHeightWidth: any = {};
  @ViewChild('printable') printable: ElementRef;
  constructor(
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private service: AppointmentLocationService,
    private recordCreationService: RecordCreationService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive = event.url.indexOf('masters/appointment-location/new') !== -1 || event.url.indexOf('masters/appointment-location/edit') !== -1;

        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'Appointment Location List';
        }
        else {
          if (event.url.indexOf('masters/appointment-location/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Create New Appointment Location';
          }
          else if (event.url.indexOf('masters/appointment-location/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'Appointment Location Info';
          }
          else {
          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      record => {
        if (record.table == 'Appointment Location') {
          var newRowData = {
            id: record.id,
            name: record.name,
            address: record.address,
            city: record.city,
            state: record.state,
            zipCode: record.zipCode,
            mapUrl: record.mapUrl
          }
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(['masters/appointment-location']);
        }
      });

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      record => {
        if (record.table == 'Appointment Location') {

          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;
              //change here only 

              newRow.name = record.name;
              newRow.address = record.address;
              newRow.city = record.city;
              newRow.state = record.state;
              newRow.zipCode = record.zipCode;
              newRow.mapUrl = record.mapUrl;
              //********************** */
              return newRow;
            }
          });
          this.gridApi.updateRowData({ update: [newRowData] });
          this.router.navigate(['masters/appointment-location']);
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
      this.router.navigate(['masters/appointment-location']);
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
          // Handle various error formats safely using the utility
          const errorMessage = ErrorUtils.extractErrorMessage(error);
          this.toastrMessageService.showInfo(errorMessage, "Info");
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
      { field: 'name', headerName: 'Name', width: 200, filter: true, sortable: true, resizable: true },
      { field: 'address', headerName: 'Address', width: 200, filter: true, sortable: true, resizable: true },
      { field: 'city', headerName: 'City', width: 150, filter: true, sortable: true, resizable: true },
      { field: 'state', headerName: 'State', width: 150, filter: true, sortable: true, resizable: true },
      { field: 'zipCode', headerName: 'Zip Code', width: 100, filter: true, sortable: true, resizable: true },
      { field: 'mapUrl', headerName: 'Map URL', width: 200, filter: true, sortable: true, resizable: true }
    ];
  }

  frameworkComponents = {
    editButtonRendererComponent: AgEditButtonRendererComponent,
    deleteButtonRendererComponent: AgDeleteButtonRendererComponent
  };

  getFilters() {
    var obj: any = {
      searchText: "",
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
    this.router.navigate(['masters/appointment-location/edit/' + e.rowData.id]);
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
    this.router.navigate(['masters/appointment-location/new']);
  }

  onBack() {
    this.router.navigate(['masters/appointment-location']);
  }
}