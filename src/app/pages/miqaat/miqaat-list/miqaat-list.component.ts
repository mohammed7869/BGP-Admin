import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ColDef } from "ag-grid-community";
import { Subscription } from "rxjs";
import { appCommon } from "src/app/common/_appCommon";
import { MiqaatService } from "src/app/providers/services/miqaat.service";
import { ToastrMessageService } from "src/app/providers/services/toastr-message.service";
import { RecordCreationService } from "src/app/providers/services/record-creation.service";
import { AgDeleteButtonRendererComponent } from "src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component";
import { AgEditButtonRendererComponent } from "src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component";
import * as moment from "moment";

@Component({
  selector: "app-miqaat-list",
  templateUrl: "./miqaat-list.component.html",
  styleUrls: ["./miqaat-list.component.scss"],
})
export class MiqaatListComponent implements OnInit, OnDestroy {
  showFilters: boolean = false;
  form: FormGroup;
  columnDefs: ColDef[];
  lst: any = [];
  gridApi: any;

  isBtnLoading: boolean = false;
  submitted: boolean = false;

  public appCommon = appCommon;
  pageTitle: String = "Miqaats";
  gridHeightWidth: any = {};
  updateSubscription: Subscription;

  @ViewChild("printable") printable: ElementRef;

  constructor(
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private miqaatService: MiqaatService,
    private recordCreationService: RecordCreationService
  ) {
    this.updateSubscription =
      this.recordCreationService.recordUpdated$.subscribe((record) => {
        if (record.table == "Miqaat") {
          let updatedMiqaat = this.lst.find((row: any) => row.id == record.id);
          if (updatedMiqaat) {
            // Update the miqaat data
            updatedMiqaat.miqaatName = record.miqaatName;
            updatedMiqaat.jamaat = record.jamaat;
            updatedMiqaat.jamiyat = record.jamiyat;
            updatedMiqaat.fromDate = record.fromDate;
            updatedMiqaat.tillDate = record.tillDate;
            updatedMiqaat.volunteerLimit = record.volunteerLimit;
            updatedMiqaat.aboutMiqaat = record.aboutMiqaat;
            updatedMiqaat.adminApproval = record.adminApproval;

            // Update the grid
            if (this.gridApi) {
              this.gridApi.updateRowData({ update: [updatedMiqaat] });
            }
          }
        }
      });
  }

  ngOnInit(): void {
    this.setGridHeight();
    this.createSearchForm();
    this.loadMiqaats();

    // Make approve/reject functions available globally for inline onclick handlers
    (window as any).approveMiqaat = (id: number) => {
      const miqaat = this.lst.find((m: any) => m.id === id);
      if (miqaat) {
        this.onApprove({ rowData: miqaat });
      }
    };

    (window as any).rejectMiqaat = (id: number) => {
      const miqaat = this.lst.find((m: any) => m.id === id);
      if (miqaat) {
        this.onReject({ rowData: miqaat });
      }
    };
  }

  loadMiqaats() {
    if (this.gridApi) this.gridApi.showLoadingOverlay();
    this.isBtnLoading = true;
    this.miqaatService.getAll().subscribe(
      (data) => {
        this.isBtnLoading = false;
        this.lst = data || [];

        if (data && data.length > 0 && this.submitted) {
          this.showFilters = false;
        }

        if (this.gridApi) this.gridApi.setRowData(this.lst);
      },
      (error) => {
        if (this.gridApi) this.gridApi.hideOverlay();
        this.isBtnLoading = false;
        console.error("Error loading miqaats:", error);
        let errorMessage = "Error loading miqaats";
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (typeof error == "string") {
          errorMessage = error;
        }
        this.toastrMessageService.showError(errorMessage, "Error");
        this.lst = [];
        if (this.gridApi) {
          this.gridApi.setRowData(this.lst);
        }
      }
    );
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
        (window.innerHeight * (appCommon.GridHeightPer + 0.16)).toString() +
        "px",
    };
  }

  clear() {
    this.submitted = false;
    this.form.patchValue({
      searchText: null,
      approvalStatus: null,
    });
    this.submitSearch();
  }

  submitSearch() {
    this.submitted = true;
    if (this.form.valid) {
      this.search();
    }
  }

  search() {
    this.loadMiqaats();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;

    this.columnDefs = [
      {
        field: "id",
        headerName: "",
        width: 30,
        cellRenderer: "editButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onEdit.bind(this),
        },
        pinned: "left",
        lockPosition: true,
        sortable: false,
        filter: false,
      },
      {
        field: "id",
        headerName: "",
        width: 30,
        cellRenderer: "deleteButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onDelete.bind(this),
        },
        pinned: "left",
        lockPosition: true,
        sortable: false,
        filter: false,
      },
      {
        field: "miqaatName",
        headerName: "Miqaat Name",
        sortable: true,
        filter: true,
        resizable: true,
        width: 200,
      },
      {
        field: "jamaat",
        headerName: "Jamaat",
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
      },
      {
        field: "jamiyat",
        headerName: "Jamiyat",
        sortable: true,
        filter: true,
        resizable: true,
        width: 80,
      },
      {
        field: "fromDate",
        headerName: "From Date",
        sortable: true,
        filter: true,
        resizable: true,
        width: 100,
        cellRenderer: (params) => {
          if (params.value) {
            return moment(params.value).format("DD MMM YYYY");
          }
          return "";
        },
      },
      {
        field: "tillDate",
        headerName: "Till Date",
        sortable: true,
        filter: true,
        resizable: true,
        width: 90,
        cellRenderer: (params) => {
          if (params.value) {
            return moment(params.value).format("DD MMM YYYY");
          }
          return "";
        },
      },
      {
        field: "volunteerLimit",
        headerName: "Volunteer Limit",
        sortable: true,
        filter: true,
        resizable: true,
        width: 110,
      },
      {
        field: "captainName",
        headerName: "Created By",
        sortable: true,
        filter: true,
        resizable: true,
        width: 250,
      },
      {
        field: "adminApproval",
        headerName: "Approval Status",
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        cellRenderer: (params) => {
          const status = params.value || "Pending";
          let badgeClass = "bg-warning";
          if (status === "Approved") {
            badgeClass = "bg-success";
          } else if (status === "Rejected") {
            badgeClass = "bg-danger";
          }
          return `
            <span class="badge ${badgeClass} px-3 py-2 d-flex align-items-center justify-content-center" 
                  style="font-size: 11px; min-width: 80px; border-radius: 20px; font-weight: 600;">
              ${status}
            </span>
          `;
        },
      },

      {
        field: "createdAt",
        headerName: "Created At",
        sortable: true,
        filter: true,
        resizable: true,
        width: 180,
        cellRenderer: (params) => {
          if (params.value) {
            return moment(params.value).format("DD MMM YYYY HH:mm");
          }
          return "";
        },
      },
    ];
  }

  frameworkComponents = {
    editButtonRendererComponent: AgEditButtonRendererComponent,
    deleteButtonRendererComponent: AgDeleteButtonRendererComponent,
  };

  createSearchForm(): void {
    this.form = this.fb.group({
      searchText: [""],
      approvalStatus: [""],
    });
  }

  onEdit(e: any) {
    this.router.navigate(["miqaats/edit/" + e.rowData.id]);
  }

  onDelete(e: any) {
    if (
      confirm(
        `Are you sure you want to delete miqaat "${e.rowData.miqaatName}"? This action cannot be undone.`
      )
    ) {
      this.isBtnLoading = true;
      this.miqaatService.delete(e.rowData.id).subscribe(
        (data) => {
          this.isBtnLoading = false;
          this.toastrMessageService.showSuccess(
            "Miqaat deleted successfully",
            "Success"
          );
          this.loadMiqaats();
        },
        (error) => {
          this.isBtnLoading = false;
          let errorMessage = "Error deleting miqaat";
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          this.toastrMessageService.showError(errorMessage, "Error");
        }
      );
    }
  }

  onApprove(e: any) {
    if (
      confirm(
        `Are you sure you want to approve miqaat "${e.rowData.miqaatName}"?`
      )
    ) {
      this.isBtnLoading = true;
      this.miqaatService
        .updateApprovalStatus(e.rowData.id, "Approved")
        .subscribe(
          (data) => {
            this.isBtnLoading = false;
            this.toastrMessageService.showSuccess(
              "Miqaat approved successfully",
              "Success"
            );
            this.loadMiqaats();
          },
          (error) => {
            this.isBtnLoading = false;
            let errorMessage = "Error approving miqaat";
            if (error?.error?.message) {
              errorMessage = error.error.message;
            } else if (error?.message) {
              errorMessage = error.message;
            }
            this.toastrMessageService.showError(errorMessage, "Error");
          }
        );
    }
  }

  onReject(e: any) {
    if (
      confirm(
        `Are you sure you want to reject miqaat "${e.rowData.miqaatName}"?`
      )
    ) {
      this.isBtnLoading = true;
      this.miqaatService
        .updateApprovalStatus(e.rowData.id, "Rejected")
        .subscribe(
          (data) => {
            this.isBtnLoading = false;
            this.toastrMessageService.showSuccess(
              "Miqaat rejected successfully",
              "Success"
            );
            this.loadMiqaats();
          },
          (error) => {
            this.isBtnLoading = false;
            let errorMessage = "Error rejecting miqaat";
            if (error?.error?.message) {
              errorMessage = error.error.message;
            } else if (error?.message) {
              errorMessage = error.message;
            }
            this.toastrMessageService.showError(errorMessage, "Error");
          }
        );
    }
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}
