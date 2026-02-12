import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { appCommon } from 'src/app/common/_appCommon';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { filter } from 'rxjs/operators';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-doctors-profiles-search',
  templateUrl: './doctors-profiles-search.component.html',
  styleUrls: ['./doctors-profiles-search.component.scss']
})
export class DoctorsProfilesSearchComponent implements OnInit {
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
  pageTitle: String = 'Care Connect Profiles';
  gridHeightWidth: any = {};
  @ViewChild('printable') printable: ElementRef;

  constructor(
    private router: Router,
    private location: Location,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private recordCreationService: RecordCreationService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive = event.url.indexOf('doctors-profiles/new') !== -1 || event.url.indexOf('doctors-profiles/edit') !== -1;

        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'Care Connect Profiles';
        }
        else {
          if (event.url.indexOf('doctors-profiles/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Create New Doctor Profile';
          }
          else if (event.url.indexOf('doctors-profiles/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'Doctor Profile Details';
          }
          else {
          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      record => {
        if (record.table == 'Doctor Profile') {
          var newRowData = {
            id: record.id,
            initials: record.initials,
            name: record.name,
            title: record.title,
            npiNumber: record.npiNumber,
            isPublished: record.isPublished,
          }
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(['doctors-profiles']);
        }
      });

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      record => {
        if (record.table == 'Doctor Profile') {
          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;
              newRow.initials = record.initials;
              newRow.name = record.name;
              newRow.title = record.title;
              newRow.npiNumber = record.npiNumber;
              newRow.isPublished = record.isPublished;
              return newRow;
            }
          });
          this.gridApi.updateRowData({ update: newRowData });
          this.router.navigate(['doctors-profiles']);
        }
      });
  }

  ngOnInit(): void {
    this.createSearchForm();
    this.setGridHeight();
    this.search();
  }

  ngAfterViewInit() {
    this.setGridHeight();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setGridHeight();
  }

  setGridHeight() {
    this.gridHeightWidth = { height: 'calc(100vh - 300px)' };
  }

  clear() {
    this.form.reset();
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.insertSubscription) {
      this.insertSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  submitSearch() {
    this.submitted = true;
    if (this.form.valid) {
      this.isBtnLoading = true;
      this.search();
    }
  }

  submitItemExportToExcel(type: number) {
    if (this.lst.length > 0) {
      this.isBtnLoading = true;
      if (type == 1) {
        // For now, just show a message. In the future, this will use a service
        this.toastrMessageService.showInfo('Export functionality will be implemented with backend integration', 'Info');
      }
      else if (type == 2) {
        this.generatePdf();
      }
      this.isBtnLoading = false;
    }
    else {
      this.toastrMessageService.showError('No data to export', 'Error');
    }
  }

  generatePdf() {
    const element = this.printable.nativeElement;
    const opt = {
      margin: 1,
      filename: 'Doctors_Profiles_List.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  }

  search() {
    // Static data based on the screenshots
    this.lst = [
      {
        id: 1,
        initials: 'BS',
        name: 'Dr. Bhavneet Singh',
        title: 'DDS',
        npiNumber: '1417537291',
        isPublished: true
      },
      {
        id: 2,
        initials: 'JL',
        name: 'Dr. Joyce Lau',
        title: 'DDS',
        npiNumber: '1234567890',
        isPublished: true
      },
      {
        id: 3,
        initials: 'SA',
        name: 'Sahiba Atwal-Purewal',
        title: 'DDS',
        npiNumber: '0987654321',
        isPublished: true
      },
      {
        id: 4,
        initials: 'EH',
        name: 'Dr. Egli Hajdarmataj',
        title: 'DMD',
        npiNumber: '1122334455',
        isPublished: true
      },
      {
        id: 5,
        initials: 'JS',
        name: 'Dr. Jimi Stewart',
        title: 'DMD',
        npiNumber: '5566778899',
        isPublished: true
      },
      {
        id: 6,
        initials: 'JK',
        name: 'Dr. Joey Kim',
        title: 'DMD',
        npiNumber: '9988776655',
        isPublished: true
      }
    ];
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnDefs = [
      {
        headerName: 'Doctor',
        field: 'doctorInfo',
        cellRenderer: (params: any) => {
          return `
            <div style="display: flex; align-items: center; gap: 12px;">
              
              <div>
                <div style="font-weight: 500; color: #212529;">${params.data.name}, ${params.data.title}</div>
                <div style="font-size: 12px; color: #6c757d;">NPI: ${params.data.npiNumber}</div>
              </div>
            </div>
          `;
        },
        width: 300,
        sortable: true,
        filter: true
      },
    //   {
    //     headerName: 'Status',
    //     field: 'isPublished',
    //     cellRenderer: (params: any) => {
    //       return params.data.isPublished ? 
    //         '<span style="color: #198754; font-weight: 500;">Published</span>' : 
    //         '<span style="color: #dc3545; font-weight: 500;">Unpublished</span>';
    //     },
    //     width: 120,
    //     sortable: true,
    //     filter: true
    //   },
      {
        headerName: 'Actions',
        field: 'actions',
        cellRenderer: 'agEditButtonRenderer',
        cellRendererParams: {
          onClick: this.onEdit.bind(this),
          label: 'Edit',
          class: 'btn btn-warning btn-sm'
        },
        width: 100,
        sortable: false,
        filter: false
      },
      {
        headerName: '',
        field: 'delete',
        cellRenderer: 'agDeleteButtonRenderer',
        cellRendererParams: {
          onClick: this.onDelete.bind(this),
          label: 'Delete',
          class: 'btn btn-danger btn-sm'
        },
        width: 100,
        sortable: false,
        filter: false
      }
    ];
  }

  frameworkComponents = {
    agEditButtonRenderer: AgEditButtonRendererComponent,
    agDeleteButtonRenderer: AgDeleteButtonRendererComponent
  }

  getFilters() {
    return this.form.value;
  }

  createSearchForm(): void {
    this.form = this.fb.group({
      searchText: [''],
      resultType: ['']
    });
  }

  onEdit(e: any) {
    this.router.navigate(['doctors-profiles/edit', e.rowData.id]);
  }

  onDelete(e: any) {
    if (confirm('Are you sure you want to delete this doctor profile?')) {
      this.lst = this.lst.filter((item: any) => item.id !== e.rowData.id);
      this.gridApi.updateRowData({ remove: [e.rowData] });
      this.toastrMessageService.showSuccess('Doctor profile deleted successfully', 'Success');
    }
  }

  onCreate() {
    this.router.navigate(['doctors-profiles/new']);
  }

  onBack() {
    this.router.navigate(['doctors-profiles']);
  }
}
