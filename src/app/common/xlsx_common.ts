import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const xlsxCommon = {

  // The actual plugin constructor
  data2xlsx(options) {

    //const wb: WorkBook = new WorkBook();
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    var data = this.tableToJson(options.data);
    var ws = this.sheet_from_array_of_arrays(data);

    /* add worksheet to workbook */
    wb.SheetNames.push(options.sheetName);
    wb.Sheets[options.sheetName] = ws;

    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), options.filename);
  },

  sheet_from_array_of_arrays(data, opts) {

    var ws = {};
    var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    for (var R = 0; R != data.length; ++R) {
      for (var C = 0; C != data[R].length; ++C) {
        if (range.s.r > R) range.s.r = R;
        if (range.s.c > C) range.s.c = C;
        if (range.e.r < R) range.e.r = R;
        if (range.e.c < C) range.e.c = C;
        var cell: any = { v: data[R][C] };
        if (cell.v == null) continue;
        cell.v = cell.v.toString();
        var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

        if (typeof cell.v === 'number') cell.t = 'n';
        else if (typeof cell.v === 'boolean') cell.t = 'b';
        else if (cell.v instanceof Date) {
          cell.t = 'n';
          cell.z = XLSX.SSF._table[14];
          //cell.v = XLSX.datenum(cell.v);
        }
        else cell.t = 's';

        if (R == 0) {
          cell.s = {
            font: {
              bold: true,
            },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
            alignment: {
              wrapText: true,
              //horizontal: "top",
              //vertical: "top"
            }
          }
        }
        else {
          cell.s = {
            font: {
              alignLeft: true,
            },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
            alignment: {
              wrapText: true,
              //horizontal: "top",
              //vertical: "top"
            }
          }
        }

        ws[cell_ref] = cell;
      }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
  },

  Workbook() {
    var wb : any = XLSX.utils.book_new();
    if (!(this instanceof wb)) return new wb;
    this.SheetNames = [];
    this.Sheets = {};
  },

  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  },

  tableToJson(table) {
    var data = []; // first row needs to be headers
    var header = [];

    for (var key in table[0]) {
      header.push(key);
    }
    data.push(header);

    // go through cells 
    for (var i = 0; i < table.length; i++) {

      var tableRow = table[i];
      var rowData = [];

      for (var key in tableRow) {
        rowData.push(tableRow[key]);
      }

      data.push(rowData);
    }

    return data;
  }  
};