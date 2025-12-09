import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { appCommon } from 'src/app/common/_appCommon';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmsMetaService } from 'src/app/providers/services/cms-meta.service';
import { NavigationEnd, Router } from '@angular/router';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { filter } from 'rxjs/operators';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-cms-meta-search',
  templateUrl: './cms-meta-search.component.html',
  styleUrls: ['./cms-meta-search.component.scss']
})
export class CmsMetaSearchComponent implements OnInit {
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
  pageTitle: String = 'Meta Tags';
  gridHeightWidth: any = {};
  @ViewChild('printable') printable: ElementRef;

  frameworkComponents = {
    editButtonRendererComponent: AgEditButtonRendererComponent,
    deleteButtonRendererComponent: AgDeleteButtonRendererComponent
  };

  constructor(
    private router: Router,
    private location: Location,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private service: CmsMetaService,
    private recordCreationService: RecordCreationService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive = event.url.indexOf('cms-meta/new') !== -1 || event.url.indexOf('cms-meta/edit') !== -1;

        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'Meta Tags';
        }
        else {
          if (event.url.indexOf('cms-meta/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Create New Meta Tag';
          }
          else if (event.url.indexOf('cms-meta/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'Meta Tag Info';
          }
          else {
          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      record => {
        if (record.table == 'CMS Meta') {
          var newRowData = {
            id: record.id,
            metaKey: record.metaKey,
            metaValue: record.metaValue
          }
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(['cms-meta']);
        }
      });

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      record => {
        if (record.table == 'CMS Meta') {
          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;
              newRow.metaKey = record.metaKey;
              newRow.metaValue = record.metaValue;
              return newRow;
            }
          });
          this.gridApi.updateRowData({ update: newRowData });
          this.router.navigate(['cms-meta']);
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
      metaKey: [''],
      metaValue: ['']
    });
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
        headerName: 'Meta Key',
        field: 'metaKey',
        sortable: true,
        filter: true,
        width: 200
      },
      {
        headerName: 'Meta Value',
        field: 'metaValue',
        sortable: true,
        filter: true,
        width: 300
      },
      {
        headerName: '',
        cellRenderer: 'editButtonRendererComponent',
        cellRendererParams: {
          onClick: this.onEdit.bind(this),
          label: 'Edit'
        },
        width: 25
      },
      {
        headerName: '',
        cellRenderer: 'deleteButtonRendererComponent',
        cellRendererParams: {
          onClick: this.onDelete.bind(this),
          label: 'Delete'
        },
        width: 25
      }
    ];
  }

  loadData(): void {
    this.isBtnLoading = true;
    this.service.getAll().subscribe(
      data => {
        this.isBtnLoading = false;
        this.lst = data || [];
      },
      error => {
        this.isBtnLoading = false;
        this.toastrMessageService.showError('Error loading data', 'Error');
      }
    );
  }

  onSearch(): void {
    this.isBtnLoading = true;
    this.service.getAll().subscribe(
      data => {
        this.isBtnLoading = false;
        this.lst = data || [];
      },
      error => {
        this.isBtnLoading = false;
        this.toastrMessageService.showError('Error searching data', 'Error');
      }
    );
  }

  onReset(): void {
    this.form.reset();
    this.loadData();
  }

  onNew(): void {
    this.router.navigate(['cms-meta/new']);
  }

  onEdit(params: any): void {
    this.router.navigate(['cms-meta/edit', params.rowData.id]);
  }

  onDelete(params: any): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.service.delete(params.rowData.id).subscribe(
        data => {
          this.toastrMessageService.showSuccess('Record deleted successfully', 'Success');
          this.loadData();
        },
        error => {
          this.toastrMessageService.showError('Error deleting record', 'Error');
        }
      );
    }
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
