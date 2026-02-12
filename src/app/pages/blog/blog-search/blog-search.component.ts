import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { appCommon } from 'src/app/common/_appCommon';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlogService } from 'src/app/providers/services/blog.service';
import { NavigationEnd, Router } from '@angular/router';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { filter } from 'rxjs/operators';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import html2pdf from 'html2pdf.js';
import * as moment from 'moment';

@Component({
  selector: 'app-blog-search',
  templateUrl: './blog-search.component.html',
  styleUrls: ['./blog-search.component.scss']
})
export class BlogSearchComponent implements OnInit {
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
  pageTitle: String = 'Blog Posts';
  gridHeightWidth: any = {};
  @ViewChild('printable') printable: ElementRef;

  constructor(
    private router: Router,
    private location: Location,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private service: BlogService,
    private recordCreationService: RecordCreationService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive = event.url.indexOf('blog/new') !== -1 || event.url.indexOf('blog/edit') !== -1;

        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'Blog Posts';
        }
        else {
          if (event.url.indexOf('blog/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Create New Blog Post';
          }
          else if (event.url.indexOf('blog/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'Blog Post Info';
          }
          else {
          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      record => {
        if (record.table == 'Blog Post') {
          var newRowData = {
            id: record.id,
            title: record.title,
            authorName: record.authorName,
            contentType: record.contentType,
            blogStatus: record.blogStatus,
            visibility: record.visibility,
            publishedDate: record.publishedDate
          }
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(['blog']);
        }
      });

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      record => {
        if (record.table == 'Blog Post') {
          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;
              newRow.title = record.title;
              newRow.authorName = record.authorName;
              newRow.contentType = record.contentType;
              newRow.blogStatus = record.blogStatus;
              newRow.visibility = record.visibility;
              newRow.publishedDate = record.publishedDate;
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
      title: [""],
      authorName: [""],
      contentType: [""],
      blogStatus: [""],
      visibility: [""]
    })
  }

  setColumnDefs(): void {
    this.columnDefs = [
      { headerName: "", width: 30, resizable: true, sortable: true, filter: true, valueGetter: "node.rowIndex + 1", },
      { headerName: 'Title', field: 'title', sortable: true, filter: true, width: 200, },
      {
        headerName: 'Author',
        field: 'authorName',
        sortable: true,
        filter: true,
        width: 150,

      },
      {
        headerName: 'Content Type',
        field: 'contentType',
        sortable: true,
        filter: true,
        width: 120,

      },
      {
        headerName: 'Status',
        field: 'blogStatus',
        sortable: true,
        filter: true,
        width: 100,

      },
      {
        headerName: 'Visibility',
        field: 'visibility',
        sortable: true,
        filter: true,
        width: 100,

      },
      {
        headerName: 'Published Date',
        field: 'publishedDate',
        sortable: true,
        filter: true,
        width: 150,
        valueFormatter: function (params) {
          return params.value ? moment(params.value).format('DD/MM/YYYY ' + 'hh:mm A') : '';
        },
      },
      {
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
        this.toastrMessageService.showError(error.error.message || 'Error loading blog posts', 'Error');
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
    this.router.navigate(['blog/edit', params.rowData.id]);
  }

  onDelete(params: any): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.service.delete(params.rowData.id).subscribe(
        data => {
          this.toastrMessageService.showSuccess('Blog post deleted successfully', 'Success');
          this.loadData();
        },
        error => {
          this.toastrMessageService.showError(error.error.message || 'Error deleting blog post', 'Error');
        }
      );
    }
  }

  onNew(): void {
    this.router.navigate(['blog/new']);
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
      filename: 'blog-posts.pdf',
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
