import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { appCommon } from 'src/app/common/_appCommon';
import { EnquiryService } from 'src/app/providers/services/enquiry.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
import { UtcToLocalPipe } from 'src/app/shared/pipe/utc-to-local.pipe';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent implements OnInit {
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
  pageTitle: String = 'Enquiry';
  gridHeightWidth: any = {};
  @ViewChild('printable') printable: ElementRef;
  constructor(
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private service: EnquiryService,
    private recordCreationService: RecordCreationService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive = event.url.indexOf('enquiry/new') !== -1 || event.url.indexOf('enquiry/edit') !== -1;

        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'Enquiry';
        }
        else {
          if (event.url.indexOf('enquiry/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Create New Enquiry';
          }
          else if (event.url.indexOf('enquiry/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'Enquiry Info';
          }
          else {
          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      record => {
        if (record.table == 'Enquiry') {
          var newRowData = {
            id: record.id,
            name: record.name,
            email: record.email,
            phone: record.phone,
            subject: record.subject,
            message: record.message,
            createdAt: record.createdAt,
            status: record.status,
          }
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(['enquiry']);
        }
      });

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      record => {
        if (record.table == 'Enquiry') {

          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;
              //change here only 

              newRow.name = record.name;
              newRow.email = record.email;
              newRow.phone = record.phone;
              newRow.subject = record.subject;
              newRow.message = record.message;
              newRow.createdAt = record.createdAt;
              newRow.status = record.status;
              //********************** */
              return newRow;
            }
          });
          this.gridApi.updateRowData({ update: [newRowData] });
          this.router.navigate(['enquiry']);
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
      height: (window.innerHeight * (appCommon.GridHeightPer + 0.14)).toString() + 'px',
    };
  }

  clear() {
    this.submitted = false;
    this.createSearchForm();
    this.submitSearch();
  }

  back() {
    if (this.isChildRouteActive) {
      this.router.navigate(['enquiry']);
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
          a.setAttribute("download", type == 2 ? 'enquiries.csv' : 'enquiries.xlsx');
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
      { field: 'name', headerName: 'Name', sortable: true, filter: true, resizable: true, width: 200 },
      { field: 'email', headerName: 'Email', sortable: true, filter: true, resizable: true, width: 250 },
      { field: 'phoneNumber', headerName: 'Phone', sortable: true, filter: true, resizable: true, width: 150 },
      { field: 'subject', headerName: 'Subject', sortable: true, filter: true, resizable: true, width: 250 },
      {
        field: 'message', headerName: 'Message', sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (params) => {
          return params.value ? params.value.substring(0, 100) + (params.value.length > 100 ? '...' : '') : '';
        },
        width: 300
      },
      {
        field: 'createdDate', headerName: 'Enquiry Date', sortable: true, filter: true, resizable: true, width: 150,
        cellRenderer: params => {
          if (!params.value) return '';
          return `${new UtcToLocalPipe().transform(params.value, 'MMM dd,YYYY')} at ${new UtcToLocalPipe().transform(params.value, 'shortTime')}`;
        },
      },
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
    this.router.navigate(['enquiry/edit/' + e.rowData.id]);
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
    this.router.navigate(['enquiry/new']);
  }

  onBack() {
    this.router.navigate(['enquiry']);
  }
}