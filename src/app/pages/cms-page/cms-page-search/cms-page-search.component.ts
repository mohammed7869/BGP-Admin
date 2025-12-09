import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { Location } from "@angular/common";
import { ColDef } from "ag-grid-community";
import { appCommon } from "src/app/common/_appCommon";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CmsPageService } from "src/app/providers/services/cms-page.service";
import { NavigationEnd, Router } from "@angular/router";
import { RecordCreationService } from "src/app/providers/services/record-creation.service";
import { AgEditButtonRendererComponent } from "src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component";
import { AgDeleteButtonRendererComponent } from "src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component";
import { filter } from "rxjs/operators";
import { ToastrMessageService } from "src/app/providers/services/toastr-message.service";
import html2pdf from "html2pdf.js";

@Component({
  selector: "app-cms-page-search",
  templateUrl: "./cms-page-search.component.html",
  styleUrls: ["./cms-page-search.component.scss"],
})
export class CmsPageSearchComponent implements OnInit {
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
  breadcrumbTitle: String = "List";
  pageTitle: String = "CMS Page";
  gridHeightWidth: any = {};
  @ViewChild("printable") printable: ElementRef;
  constructor(
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private service: CmsPageService,
    private recordCreationService: RecordCreationService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive =
          event.url.indexOf("cms-page/new") !== -1 ||
          event.url.indexOf("cms-page/edit") !== -1;

        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = "List";
          this.pageTitle = "Pages";
        } else {
          if (event.url.indexOf("cms-page/new") !== -1) {
            this.breadcrumbTitle = "New";
            this.pageTitle = "Create New Page";
          } else if (event.url.indexOf("cms-page/edit") !== -1) {
            this.breadcrumbTitle = "Edit";
            this.pageTitle = "Page Info";
          } else {
          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      (record) => {
        if (record.table == "CMS Page") {
          var newRowData = {
            id: record.id,
            name: record.name,
            slug: record.slug,
            title: record.title,
            heading: record.heading,
            isPublished: record.isPublished,
            isDraft: record.isDraft,
            isHomePage: record.isHomePage,
            isLandingPage: record.isLandingPage,
            publishDate: record.publishDate,
            createdDate: record.createdDate,
          };
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(["cms-page"]);
        }
      }
    );

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      (record) => {
        if (record.table == "CMS Page") {
          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;
              newRow.name = record.name;
              newRow.slug = record.slug;
              newRow.title = record.title;
              newRow.heading = record.heading;
              newRow.isPublished = record.isPublished;
              newRow.isDraft = record.isDraft;
              newRow.isHomePage = record.isHomePage;
              newRow.isLandingPage = record.isLandingPage;
              newRow.publishDate = record.publishDate;
              newRow.modifiedDate = record.modifiedDate;
              return newRow;
            }
            return row;
          });
          this.lst = newRowData;
          this.gridApi.updateRowData({ update: newRowData });
          this.router.navigate(["cms-page"]);
        }
      }
    );
  }

  ngOnInit(): void {
    this.setGridHeight();
    this.createSearchForm();

    this.search();
  }

  ngAfterViewInit() {}

  @HostListener("window:resize", ["$event"])
  onWindowResize() {
    this.setGridHeight();
  }

  setGridHeight() {
    this.gridHeightWidth = {
      width: "100%",
      height:
        (window.innerHeight * (appCommon.GridHeightPer + 0.04)).toString() +
        "px",
    };
  }

  clear() {
    this.submitted = false;
    this.createSearchForm();
    this.submitSearch();
  }

  back() {
    if (this.isChildRouteActive) {
      this.router.navigate(["cms-page"]);
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
    } else {
      if (this.form.value.resultType == 1) {
        this.search();
      } else if (
        this.form.value.resultType == 2 ||
        this.form.value.resultType == 3
      ) {
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

    this.service.export(fdata).subscribe(
      (data) => {
        if (data.size) {
          const a = document.createElement("a");
          const objectUrl = URL.createObjectURL(data);
          a.href = objectUrl;
          a.setAttribute(
            "download",
            type == 2 ? "applicationMasters.csv" : "applicationMasters.xlsx"
          );
          a.click();
          URL.revokeObjectURL(objectUrl);
        } else {
          this.toastrMessageService.showInfo(
            "No data found to export.",
            "Info"
          );
        }
        this.isBtnLoading = false;
      },
      async (error) => {
        this.isBtnLoading = false;
        const temp = await new Response(error).json();
        this.toastrMessageService.showInfo(temp.message, "Info");
      }
    );
  }

  generatePdf() {
    const content = this.printable.nativeElement;
    const options = {
      filename: "document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { dpi: 192, letterRendering: true },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      margin: [30, 20, 40, 20],
      onBeforeStart: () => {
        this.isBtnLoading = true;
      },
      onAfterPdfGeneration: () => {
        this.isBtnLoading = false;
      },
      style: {
        color: "#000000", // Black color
      },
    };

    const pdf = html2pdf().from(content).set(options).output("blob");

    pdf.then((blob) => {
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank");
      printWindow.onload = () => {
        printWindow.print();
      };
    });
  }

  search() {
    var fdata = this.getFilters();
    this.isBtnLoading = true;
    this.service.getAll(fdata).subscribe(
      (data) => {
        this.isBtnLoading = false;
        this.lst = data;
      },
      (error) => {
        this.isBtnLoading = false;
        this.toastrMessageService.showInfo(error.error.message, "Info");
        this.lst = [];
        this.gridApi.setRowData(this.lst);
      }
    );
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
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
        headerName: "Name",
        field: "name",
        sortable: true,
        filter: true,
        width: 150,
      },
      {
        headerName: "Slug",
        field: "slug",
        sortable: true,
        filter: true,
        width: 150,
      },
      {
        headerName: "Title",
        field: "title",
        sortable: true,
        filter: true,
        width: 200,
      },
      {
        headerName: "Heading",
        field: "heading",
        sortable: true,
        filter: true,
        width: 200,
      },
      {
        sortable: false,
        filter: false,
        width: 25,
        cellRenderer: "editButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onEdit.bind(this),
          label: "Edit",
        },
      },
      {
        sortable: false,
        filter: false,
        width: 25,
        cellRenderer: "deleteButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onDelete.bind(this),
          label: "Delete",
        },
      },
    ];
  }

  frameworkComponents = {
    editButtonRendererComponent: AgEditButtonRendererComponent,
    deleteButtonRendererComponent: AgDeleteButtonRendererComponent,
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
    this.router.navigate(["cms-page/edit/" + e.rowData.id]);
  }

  onDelete(e: any) {
    if (confirm("Are you sure want to delete record ?")) {
      this.service.delete(e.rowData.id).subscribe(
        (data) => {
          this.toastrMessageService.showSuccess(
            "Record deleted successfully.",
            "Success"
          );
          this.lst.splice(e.rowData.index, 1);
          this.gridApi.updateRowData({ remove: [e.rowData] });
        },
        (error) => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        }
      );
    }
  }

  onCreate() {
    this.router.navigate(["cms-page/new"]);
  }

  onBack() {
    this.router.navigate(["cms-page"]);
  }
}
