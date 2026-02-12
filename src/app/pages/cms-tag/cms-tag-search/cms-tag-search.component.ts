import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { appCommon } from 'src/app/common/_appCommon';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CmsTagService } from 'src/app/providers/services/cms-tag.service';
import { NavigationEnd, Router } from '@angular/router';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { filter } from 'rxjs/operators';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-cms-tag-search',
  templateUrl: './cms-tag-search.component.html',
  styleUrls: ['./cms-tag-search.component.scss']
})
export class CmsTagSearchComponent implements OnInit {
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
  pageTitle: String = 'CMS Tags';
  gridHeightWidth: any = {};
  @ViewChild('printable') printable: ElementRef;

  constructor(
    private router: Router,
    private location: Location,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private service: CmsTagService,
    private recordCreationService: RecordCreationService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive = event.url.indexOf('cms-tag/new') !== -1 || event.url.indexOf('cms-tag/edit') !== -1;

        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'Tags';
        }
        else {
          if (event.url.indexOf('cms-tag/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Create New Tag';
          }
          else if (event.url.indexOf('cms-tag/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'Tag Info';
          }
          else {
          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      record => {
        if (record.table == 'CMS Tag') {
          var newRowData = {
            id: record.id,
            name: record.name,
            slug: record.slug,
            createdDate: record.createdDate
          }
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(['cms-tag']);
        }
      });

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      record => {
        if (record.table == 'CMS Tag') {
          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;
              newRow.name = record.name;
              newRow.slug = record.slug;
              newRow.modifiedDate = record.modifiedDate;
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
      name: [""],
      slug: [""]
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
        headerName: 'Name',
        field: 'name',
        sortable: true,
        filter: true,
        width: 200,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Slug',
        field: 'slug',
        sortable: true,
        filter: true,
        width: 200,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: '',
        cellRenderer: 'editButtonRendererComponent',
        sortable: false,
        filter: false,
        width: 25,
        cellRendererParams: {
          onClick: this.onEdit.bind(this),
          label: 'Edit'
        },
      },
      {
        headerName: '',
        cellRenderer: 'deleteButtonRendererComponent',
        sortable: false,
        filter: false,
        width: 25,
        cellRendererParams: {
          onClick: this.onDelete.bind(this),
          label: 'Delete'
        },
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
        this.toastrMessageService.showError(error.error.message || 'Error loading CMS tags', 'Error');
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
    this.router.navigate(['cms-tag/edit', params.rowData.id]);
  }

  onDelete(params: any): void {
    if (confirm('Are you sure you want to delete this CMS tag?')) {
      this.service.delete(params.rowData.id).subscribe(
        data => {
          this.toastrMessageService.showSuccess('CMS tag deleted successfully', 'Success');
          this.loadData();
        },
        error => {
          this.toastrMessageService.showError(error.error.message || 'Error deleting CMS tag', 'Error');
        }
      );
    }
  }

  onNew(): void {
    this.router.navigate(['cms-tag/new']);
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
      filename: 'cms-tags.pdf',
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
