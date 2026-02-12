import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { appCommon } from 'src/app/common/_appCommon';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmsMediaService } from 'src/app/providers/services/cms-media.service';
import { NavigationEnd, Router } from '@angular/router';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { filter } from 'rxjs/operators';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-cms-media-search',
  templateUrl: './cms-media-search.component.html',
  styleUrls: ['./cms-media-search.component.scss']
})
export class CmsMediaSearchComponent implements OnInit {
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
  pageTitle: String = 'CMS Media';
  gridHeightWidth: any = {};
  @ViewChild('printable') printable: ElementRef;

  constructor(
    private router: Router,
    private location: Location,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private service: CmsMediaService,
    private recordCreationService: RecordCreationService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive = event.url.indexOf('cms-media/new') !== -1 || event.url.indexOf('cms-media/edit') !== -1;

        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'Media Library';
        }
        else {
          if (event.url.indexOf('cms-media/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Add New Media';
          }
          else if (event.url.indexOf('cms-media/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'Media Info';
          }
          else {
          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      record => {
        if (record.table == 'CMS Media') {
          var newRowData = {
            id: record.id,
            url: record.url,
            altText: record.altText,
            mediaType: record.mediaType,
            createdDate: record.createdDate,
            modifiedDate: record.modifiedDate,
            createdBy: record.createdBy,
            modifiedBy: record.modifiedBy
          }
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(['cms-media']);
        }
      });

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      record => {
        if (record.table == 'CMS Media') {
          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;
              newRow.url = record.url;
              newRow.altText = record.altText;
              newRow.mediaType = record.mediaType;
              newRow.modifiedDate = record.modifiedDate;
              newRow.modifiedBy = record.modifiedBy;
              return newRow;
            }
          });
          this.gridApi.updateRowData({ update: newRowData });
        }
      });
  }

  ngOnInit(): void {
    this.createForm();
    this.setColumnDefs();
    this.loadData();
  }

  createForm(): void {
    this.form = this.fb.group({
      url: [""],
      altText: [""],
      mediaType: [""]
    })
  }

  setColumnDefs(): void {
    this.columnDefs = [
      {
        headerName: "",
        width: 30,
        resizable: true,
        sortable: true,
        filter: true,
        valueGetter: "node.rowIndex + 1",
      },
      {
        headerName: 'Media Type',
        field: 'mediaType',
        sortable: true,
        filter: true,
        width: 150,
      },
      {
        headerName: 'Alt Text',
        field: 'altText',
        sortable: true,
        filter: true,
        width: 250,
      },
      {
        headerName: '',
        field: 'altText',
        sortable: false,
        filter: false,
        width: 25,
        cellRenderer: "editButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onEdit.bind(this),
          label: 'Edit'
        }
      },
      {
        headerName: '',
        field: 'altText',
        sortable: false,
        filter: false,
        width: 25,
        cellRenderer: "deleteButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onDelete.bind(this),
          label: 'Delete'
        }
      }
    ];
  }

  loadData(): void {
    this.isBtnLoading = true;
    this.service.getAll().subscribe(
      data => {
        this.lst = data || [];
        this.isBtnLoading = false;
      },
      error => {
        this.isBtnLoading = false;
        this.toastrMessageService.showError(error.error.message || 'Error loading CMS media', 'Error');
      }
    );
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.setGridHeight();
  }

  setGridHeight(): void {
    this.gridHeightWidth = {
      width: '100%',
      height: (window.innerHeight * (appCommon.GridHeightPer + 0.07)).toString() + 'px',
    };
  }

  frameworkComponents = {
    editButtonRendererComponent: AgEditButtonRendererComponent,
    deleteButtonRendererComponent: AgDeleteButtonRendererComponent
  };

  onEdit(params: any): void {
    this.router.navigate(['cms-media/edit', params.rowData.id]);
  }

  onDelete(params: any): void {
    if (confirm('Are you sure you want to delete this CMS media?')) {
      this.service.delete(params.rowData.id).subscribe(
        data => {
          this.toastrMessageService.showSuccess('CMS media deleted successfully', 'Success');
          this.loadData();
        },
        error => {
          let errorMessage = 'Error deleting CMS media';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Invalid ID provided for deletion';
          }
          this.toastrMessageService.showError(errorMessage, 'Error');
        }
      );
    }
  }

  onNew(): void {
    this.router.navigate(['cms-media/new']);
  }

  onSearch(): void {
    this.loadData();
  }

  onReset(): void {
    this.form.reset();
    this.loadData();
  }

  onPrint(): void {
    const opt = {
      margin: 1,
      filename: 'cms-media.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(this.printable.nativeElement).save();
  }

  onBack(): void {
    this.location.back();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.setGridHeight();
  }

  ngOnDestroy(): void {
    if (this.insertSubscription) {
      this.insertSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}
