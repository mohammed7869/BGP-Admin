import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-instructors-list',
  template: `
    <ag-grid-angular
      style="width: 100%; height: 500px;"
      class="ag-theme-alpine"
      [rowData]="rowData"
      [columnDefs]="columnDefs"
      [pagination]="true"
      [paginationPageSize]="10">
    </ag-grid-angular>
  `
})
export class InstructorsListComponent implements OnInit {
  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'status', headerName: 'Status', width: 120 },
    // Add more columns as needed
  ];
  rowData: any[] = [];

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.firestore.collection('instructors').valueChanges({ idField: 'id' }).subscribe(data => {
      this.rowData = data;
    });
  }
} 