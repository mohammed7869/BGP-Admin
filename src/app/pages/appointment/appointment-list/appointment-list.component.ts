import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { ColDef } from "ag-grid-community";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { appCommon } from "src/app/common/_appCommon";
import { AppointmentService } from "src/app/providers/services/appointment.service";
import { RecordCreationService } from "src/app/providers/services/record-creation.service";
import { ToastrMessageService } from "src/app/providers/services/toastr-message.service";
import { AuthServiceService } from "src/app/providers/services/auth-service.service";
import { AgDeleteButtonRendererComponent } from "src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component";
import { AgEditButtonRendererComponent } from "src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component";
import { AgCalendarButtonRendererComponent } from "src/app/shared/custom-ag-controls/ag-calendar-button-renderer/ag-calendar-button-renderer.component";
import { UtcToLocalPipe } from "src/app/shared/pipe/utc-to-local.pipe";
import * as moment from "moment";
import { formatDate } from "@angular/common";
import { xlsxCommon } from "src/app/common/xlsx_common";

@Component({
  selector: "app-appointment-list",
  templateUrl: "./appointment-list.component.html",
  styleUrls: ["./appointment-list.component.scss"],
})
export class AppointmentListComponent implements OnInit {
  showFilters: boolean = false;
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
  pageTitle: String = "Users";
  gridHeightWidth: any = {};
  isArchivedView: boolean = false;
  @ViewChild("printable") printable: ElementRef;
  constructor(
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private service: AppointmentService,
    private recordCreationService: RecordCreationService,
    private authService: AuthServiceService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive =
          event.url.indexOf("appointments/new") !== -1 ||
          event.url.indexOf("appointments/edit") !== -1;

        if (!this.isChildRouteActive) {
          // Check if we're in archived view
          const wasArchivedView = this.isArchivedView;
          if (event.url.includes("/appointments/archived")) {
            this.breadcrumbTitle = "Archived";
            this.pageTitle = "Archived Appointments";
            this.isArchivedView = true;
          } else {
            this.breadcrumbTitle = "List";
            this.pageTitle = "Users";
            this.isArchivedView = false;
          }

          // Reload data if the view type changed
          if (wasArchivedView !== this.isArchivedView) {
            this.createSearchForm(); // Recreate form with proper validators
            this.loadUsers();
          }
        } else {
          if (event.url.indexOf("appointments/new") !== -1) {
            this.breadcrumbTitle = "New";
            this.pageTitle = "Create New Appointment";
          } else if (event.url.indexOf("appointments/edit") !== -1) {
            this.breadcrumbTitle = "Edit";
            this.pageTitle = "Appointment Info";
          } else {
          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      (record) => {
        if (record.table == "Appointment") {
          var newRowData = {
            id: record.id,
            email: record.email,
            phone: record.phone,
            firstName: record.firstName,
            lastName: record.lastName,
            appointmentDateTime: record.appointmentDateTime,
            startTime: record.startTime,
            locationName: record.locationName,
            appStatus: record.appStatus,
          };

          // Only add to list if it matches the current view filter
          if (this.isArchivedView) {
            // In archived view, only show archived appointments
            if (record.appStatus === 4) {
              this.lst.unshift(newRowData);
              this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
            }
          } else {
            // In regular view, exclude archived appointments
            if (record.appStatus !== 4) {
              this.lst.unshift(newRowData);
              this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
            }
          }

          this.router.navigate(["appointments"]);
        }
      }
    );

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      (record) => {
        if (record.table == "Appointment") {
          // Find and update the appointment in the list
          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.updatedData.id) {
              var newRow = row;
              //change here only

              newRow.email = record.updatedData.email;
              newRow.phone = record.updatedData.phone;
              newRow.firstName = record.updatedData.firstName;
              newRow.lastName = record.updatedData.lastName;
              newRow.appointmentDateTime =
                record.updatedData.appointmentDateTime;
              newRow.startTime = record.updatedData.startTime;
              newRow.locationName = record.updatedData.locationName;
              newRow.appStatus = record.updatedData.appStatus;
              //********************** */
              return newRow;
            }
          });

          // Handle status changes that might require removing from current view
          if (newRowData && newRowData.length > 0) {
            const updatedAppointment = newRowData[0];

            if (this.isArchivedView) {
              // In archived view, remove if status is no longer archived
              if (updatedAppointment.appStatus !== 4) {
                this.lst = this.lst.filter(
                  (row: any) => row.id !== record.updatedData.id
                );
                this.gridApi.updateRowData({ remove: [updatedAppointment] });
              } else {
                // Update the grid
                this.gridApi.updateRowData({ update: [updatedAppointment] });
              }
            } else {
              // In regular view, remove if status becomes archived
              if (updatedAppointment.appStatus === 4) {
                this.lst = this.lst.filter(
                  (row: any) => row.id !== record.updatedData.id
                );
                this.gridApi.updateRowData({ remove: [updatedAppointment] });
              } else {
                // Update the grid
                this.gridApi.updateRowData({ update: [updatedAppointment] });
              }
            }
          }
          //this.router.navigate(['appointments']);
        }
      }
    );
  }

  ngOnInit(): void {
    this.setGridHeight();
    this.createSearchForm();
    this.loadUsers();
    this.checkIfArchivedView();
  }

  loadUsers() {
    if (this.gridApi) this.gridApi.showLoadingOverlay();
    this.isBtnLoading = true;
    this.authService.getUsers().subscribe(
      (data) => {
        this.isBtnLoading = false;
        this.lst = data || [];

        // Close filters div if results are found and this was triggered by a search
        if (data && data.length > 0 && this.submitted) {
          this.showFilters = false;
        }

        if (this.gridApi) this.gridApi.setRowData(this.lst);
      },
      (error) => {
        if (this.gridApi) this.gridApi.hideOverlay();
        this.isBtnLoading = false;
        console.error("Error loading users:", error);
        // Better error handling - check different error structures
        let errorMessage = "Error loading users";
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

  loadAppointments() {
    // Keep this method for backward compatibility, but redirect to loadUsers
    this.loadUsers();
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
      fromDate: formatDate(new Date(), "yyyy-MM-dd", "en"),
      toDate: formatDate(new Date(), "yyyy-MM-dd", "en"),
      searchText: null,
      phone: null,
      email: null,
      patientType: null,
      location: null,
      appStatus: null,
    });
    this.submitSearch();
  }

  back() {
    if (this.isChildRouteActive) {
      this.router.navigate(["admin/email-setting"]);
    } else {
    }
  }

  ngOnDestroy(): void {
    this.insertSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
  }

  submitSearch() {
    this.submitted = true;
    if (this.form.valid) {
      this.search();
    }
  }

  submitItemExportToExcel(type: number) {
    if (!this.lst || this.lst.length === 0) {
      this.toastrMessageService.showWarning(
        "No data available to export",
        "Warning"
      );
      return;
    }

    try {
      // Prepare headers
      const headers = [
        "ITS ID",
        "Full Name",
        "Email",
        "Contact",
        "Rank",
        "Jamiyat",
        "Jamaat",
        "Gender",
        "Age",
        "Status",
      ];

      // Transform user data to array of arrays
      const data = this.lst.map((user: any) => {
        return [
          user.itsId || "",
          user.fullName || "",
          user.email || "",
          user.contact || "",
          user.rank || "",
          user.jamiyat || "",
          user.jamaat || "",
          user.gender || "",
          user.age || "",
          user.isActive ? "Active" : "Inactive",
        ];
      });

      // Add headers as first row
      data.unshift(headers);

      // Generate filename with current date
      const currentDate = moment().format("YYYY-MM-DD");
      const filename = `Users_${
        this.isArchivedView ? "Archived_" : ""
      }${currentDate}.xlsx`;

      // Prepare export options
      const exportOptions = {
        data: data,
        sheetName: "Users",
        filename: filename,
        company: null, // Optional: can be set if company info is available
        reportTitle: this.isArchivedView
          ? "Archived Users Report"
          : "Users Report",
        lineData: [], // Optional: additional info lines
        merges: [], // Optional: cell merges for multi-level headers
      };

      // Export to Excel (may return Promise for large datasets)
      const exportResult = xlsxCommon.data2xlsxForDoc(exportOptions);

      // Handle async export for large datasets
      if (exportResult instanceof Promise) {
        exportResult
          .then(() => {
            this.toastrMessageService.showSuccess(
              "Users data exported successfully",
              "Success"
            );
          })
          .catch((error) => {
            console.error("Error exporting to Excel:", error);
            this.toastrMessageService.showError(
              "Error exporting users data",
              "Error"
            );
          });
      } else {
        // Synchronous export for small datasets
        this.toastrMessageService.showSuccess(
          "Users data exported successfully",
          "Success"
        );
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      this.toastrMessageService.showError(
        "Error exporting users data",
        "Error"
      );
    }
  }

  generatePdf() {}

  search() {
    this.loadUsers();
  }

  private formatAppointmentTime(date: Date, time: string): string {
    if (!date) return time;
    const appointmentDate = new Date(date);
    const formattedDate = appointmentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${formattedDate} at ${time}`;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;

    this.columnDefs = [
      {
        field: "itsId",
        headerName: "ITS ID",
        sortable: true,
        filter: true,
        resizable: true,
        width: 120,
      },
      {
        field: "fullName",
        headerName: "Full Name",
        sortable: true,
        filter: true,
        resizable: true,
        width: 250,
      },
      {
        field: "email",
        headerName: "Email",
        sortable: true,
        filter: true,
        resizable: true,
        width: 250,
      },
      {
        field: "contact",
        headerName: "Contact",
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
      },
      {
        field: "rank",
        headerName: "Rank",
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
        width: 150,
      },
      {
        field: "jamaat",
        headerName: "Jamaat",
        sortable: true,
        filter: true,
        resizable: true,
        width: 200,
      },
      {
        field: "gender",
        headerName: "Gender",
        sortable: true,
        filter: true,
        resizable: true,
        width: 100,
      },
      {
        field: "age",
        headerName: "Age",
        sortable: true,
        filter: true,
        resizable: true,
        width: 80,
      },
      {
        field: "isActive",
        headerName: "Status",
        sortable: true,
        filter: true,
        resizable: true,
        width: 100,
        cellRenderer: (params) => {
          const isActive = params.value;
          const badgeClass = isActive ? "bg-success" : "bg-danger";
          const statusText = isActive ? "Active" : "Inactive";
          return `
            <span class="badge ${badgeClass} px-3 py-2 d-flex align-items-center justify-content-center" 
                  style="font-size: 11px; min-width: 80px; border-radius: 20px; font-weight: 600;">
              ${statusText}
            </span>
          `;
        },
      },
    ];
  }

  frameworkComponents = {
    editButtonRendererComponent: AgEditButtonRendererComponent,
    deleteButtonRendererComponent: AgDeleteButtonRendererComponent,
    calendarButtonRendererComponent: AgCalendarButtonRendererComponent,
  };

  getFilters() {
    var obj: any = {
      fromDate: this.form.value.fromDate || "",
      toDate: this.form.value.toDate || "",
      contactName: this.form.value.searchText || null,
      email: this.form.value.email || null,
      phone: this.form.value.phone || null,
      isNewClient:
        this.form.value.patientType === "new"
          ? true
          : this.form.value.patientType === "returning"
          ? false
          : null,
      locationName: this.form.value.location || null,
      appStatus: this.isArchivedView ? 5 : this.form.value.appStatus || null,
    };
    return obj;
  }

  createSearchForm(): void {
    // Set validators conditionally based on archived view
    const dateValidators = this.isArchivedView ? [] : [Validators.required];

    this.form = this.fb.group({
      //fromDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), dateValidators],
      //toDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), dateValidators],
      fromDate: [null],
      toDate: [null],
      searchText: [""],
      phone: [""],
      email: [""],
      patientType: [""],
      location: [""],
      appStatus: [0], // Default to 0 (All)
      resultType: [1, [Validators.required]],
    });
  }

  onEdit(e: any) {
    // User edit functionality can be added here if needed
    // this.router.navigate(["users/edit/" + e.rowData.id]);
  }

  // onDelete(e: any) {
  //   if (confirm("Are you sure want to delete record ?")) {
  //     this.service.delete(e.rowData.id)
  //       .subscribe({
  //         next: () => {
  //           this.toastrMessageService.showSuccess("Record deleted successfully.", "Success");
  //           this.loadAppointments(); // Refresh the data
  //         },
  //         error: (error) => {
  //           console.error('Error deleting appointment:', error);
  //           this.toastrMessageService.showError("Error deleting appointment", "Error");
  //         }
  //       });
  //   }
  // }

  // New API-based cancel method
  onCancelAppointment(appointmentId: string | number) {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      this.service.cancel(appointmentId).subscribe({
        next: (response) => {
          this.toastrMessageService.showSuccess(
            "Appointment cancelled successfully.",
            "Success"
          );
          this.loadAppointments(); // Refresh the data
        },
        error: (error) => {
          console.error("Error cancelling appointment:", error);
          this.toastrMessageService.showError(
            "Error cancelling appointment",
            "Error"
          );
        },
      });
    }
  }

  // New API-based archive method
  onArchiveAppointment(appointmentId: string | number) {
    if (confirm("Are you sure you want to archive this appointment?")) {
      this.service.archive(appointmentId).subscribe({
        next: (response) => {
          this.toastrMessageService.showSuccess(
            "Appointment archived successfully.",
            "Success"
          );
          this.loadAppointments(); // Refresh the data
        },
        error: (error) => {
          console.error("Error archiving appointment:", error);
          this.toastrMessageService.showError(
            "Error archiving appointment",
            "Error"
          );
        },
      });
    }
  }

  onCreate() {
    this.router.navigate(["appointments/new"]);
  }

  onBack() {
    this.router.navigate(["appointments"]);
  }

  checkIfArchivedView() {
    const currentUrl = this.router.url;
    this.isArchivedView = currentUrl.includes("/appointments/archived");

    if (this.isArchivedView) {
      this.breadcrumbTitle = "Archived";
      this.pageTitle = "Archived Users";
    }
  }
}
