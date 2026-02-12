import * as XLSXStyle from 'xlsx-js-style';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const EXCEL_DATE_OFFSET = 25569;

export const xlsxCommon = {
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
        var cell_ref = XLSX.utils.encode_cell({ c: Number(C), r: Number(R) });

        let rawValue = cell.v;
        if (typeof rawValue === 'string') {
          // Remove commas for number conversion
          const cleaned = rawValue.replace(/,/g, '');
          if (!isNaN(Number(cleaned)) && cleaned !== '') {
            cell.v = Number(cleaned);
            cell.t = 'n';
          } else {
            cell.t = 's';
            cell.v = rawValue;
          }
        } else if (typeof rawValue === 'number') {
          cell.t = 'n';
        } else if (typeof rawValue === 'boolean') {
          cell.t = 'b';
        } else if (rawValue instanceof Date) {
          cell.t = 'n';
          cell.z = XLSX.SSF._table[14];
        } else {
          cell.t = 's';
          cell.v = rawValue != null ? rawValue.toString() : '';
        }

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
  sheet_from_array_of_arraysForDoc(data, company, reportTitle, lineData: string[], merges = []) {
    const ws = {};
    const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    const colWidths = Array(data[0] ? data[0].length : 0).fill(0);

    // Add company name row at the beginning
    const companyNameRow = Array(data[0].length).fill('');
    companyNameRow[0] = company ? company.compName : "";
    data.unshift(companyNameRow);

    // Add report title row if it exists
    let insertRowIndex = 1;
    if (reportTitle) {
      const reportTitleRow = Array(data[0].length).fill('');
      reportTitleRow[0] = reportTitle;
      data.splice(insertRowIndex++, 0, reportTitleRow);
    }

    // Add each lineData row if it exists
    if (lineData && lineData.length > 0) {
      lineData.forEach(line => {
        const lineDataRow = Array(data[0].length).fill('');
        lineDataRow[0] = line;
        data.splice(insertRowIndex++, 0, lineDataRow);
      });
    }

    // Pre-calculate styles to avoid creating new objects for each cell
    const headerRowIndex = 2 + (lineData ? lineData.length : 0);
    const companyStyle = {
      font: { color: { rgb: "ffffff" }, bold: true, sz: 12 },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "8fce00" } },
      border: { top: { style: "thin" }, bottom: { style: "thin" } }
    };
    const reportTitleStyle = {
      font: { color: { rgb: "FF000000" }, bold: true, sz: 10 },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "ffffff" } },
      border: { top: { style: "thin" }, bottom: { style: "thin" } }
    };
    const lineDataStyle = {
      font: { color: { rgb: "FF000000" }, bold: true, sz: 10 },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "ffffff" } },
      border: { top: { style: "thin" }, bottom: { style: "thin" } }
    };
    const headerStyle = {
      font: { color: { rgb: "ffffff" }, bold: true, sz: 10 },
      border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
      alignment: { wrapText: false },
      fill: { fgColor: { rgb: "00afef" } }
    };
    const dataRowStyleEven = {
      font: { color: { rgb: "FF000000" }, sz: 8 },
      border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
      alignment: { wrapText: false },
      fill: { fgColor: { rgb: "cff2ff" } }
    };
    const dataRowStyleOdd = {
      font: { color: { rgb: "FF000000" }, sz: 8 },
      border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
      alignment: { wrapText: false },
      fill: { fgColor: { rgb: "ffffff" } }
    };
    const emptyCellStyleEven = {
      font: { sz: 8 },
      fill: { fgColor: { rgb: "cff2ff" } }
    };
    const emptyCellStyleOdd = {
      font: { sz: 8 },
      fill: { fgColor: { rgb: "ffffff" } }
    };

    const dataStartRow = headerRowIndex + 1;
    const totalRows = data.length;
    const totalCols = data[0] ? data[0].length : 0;

    // Optimize range calculation - only update when necessary
    range.s.r = 0;
    range.s.c = 0;
    range.e.r = totalRows - 1;
    range.e.c = totalCols - 1;

    // Helper function to determine cell type more efficiently
    const getCellTypeAndValue = (value) => {
      if (value == null || value === undefined) {
        return { v: '', t: 's' };
      }
      
      const type = typeof value;
      if (type === 'number') {
        return { v: value, t: 'n' };
      }
      if (type === 'boolean') {
        return { v: value, t: 'b' };
      }
      if (value instanceof Date) {
        return { v: value, t: 'n', z: XLSXStyle.SSF._table[14] };
      }
      if (type === 'string') {
        const cleaned = value.replace(/,/g, '');
        const numValue = Number(cleaned);
        if (!isNaN(numValue) && cleaned !== '') {
          return { v: numValue, t: 'n' };
        }
        return { v: value, t: 's' };
      }
      return { v: String(value), t: 's' };
    };

    // Process data for the worksheet - optimized loop
    for (let R = 0; R < totalRows; R++) {
      const row = data[R];
      if (!row) continue;
      
      const isEvenRow = R % 2 === 0;
      const dataRowStyle = isEvenRow ? dataRowStyleEven : dataRowStyleOdd;
      const emptyCellStyle = isEvenRow ? emptyCellStyleEven : emptyCellStyleOdd;
      
      // Determine row style once per row
      let rowStyle;
      if (R === 0) {
        rowStyle = companyStyle;
      } else if (R === 1 && reportTitle) {
        rowStyle = reportTitleStyle;
      } else if (R >= 2 && R < headerRowIndex) {
        rowStyle = lineDataStyle;
      } else if (R === headerRowIndex) {
        rowStyle = headerStyle;
      } else {
        rowStyle = dataRowStyle;
      }

      const rowLength = row.length;
      
      // Process cells in the row
      for (let C = 0; C < rowLength; C++) {
        const cellInfo = getCellTypeAndValue(row[C]);
        const cell: any = { v: cellInfo.v, t: cellInfo.t };
        if (cellInfo.z) cell.z = cellInfo.z;

        // Calculate cell length for column width - only for data rows
        if (R >= dataStartRow) {
          const cellLength = cell.t === 'n' || cell.t === 'b' 
            ? String(cell.v).length 
            : (cell.v ? String(cell.v).length : 0);
          if (cellLength > colWidths[C]) {
            colWidths[C] = Math.max(cellLength, 2);
          }
        }

        // Apply style - reuse pre-calculated style objects
        cell.s = rowStyle;

        const cell_ref = XLSXStyle.utils.encode_cell({ c: C, r: R });
        ws[cell_ref] = cell;
      }

      // Apply background color to empty cells at the end of row
      if (rowLength < totalCols) {
        for (let C = rowLength; C < totalCols; C++) {
          const cell_ref = XLSXStyle.utils.encode_cell({ c: C, r: R });
          ws[cell_ref] = {
            t: 's',
            v: '',
            s: emptyCellStyle
          };
        }
      }
    }

    if (range.s.c < 10000000) ws['!ref'] = XLSXStyle.utils.encode_range(range);

    // Set column widths
    ws['!cols'] = colWidths.map(width => ({ wch: Math.max(width, 10) }));

    // Merge cells for company name row
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }];
    // Merge cells for report title row if it exists
    if (reportTitle) {
      ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } });
    }
    // Merge cells for each lineData row if they exist
    if (lineData && lineData.length > 0) {
      for (let i = 0; i < lineData.length; i++) {
        ws['!merges'].push({ s: { r: 2 + i, c: 0 }, e: { r: 2 + i, c: totalCols - 1 } });
      }
    }
    // Add custom merges (for multi-level headers)
    if (merges && merges.length > 0) {
      ws['!merges'].push(...merges);
    }

    return ws;
  },
  Workbook() {
    var wb: any = XLSX.utils.book_new();
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
  },
  numberToEnglish(n) {

    var string = n.toString(), units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words, and = '';

    /* Remove spaces and commas */
    string = string.replace(/[, ]/g, "");

    /* Is number zero? */
    if (parseInt(string) === 0) {
      return 'zero';
    }

    /* Array of units as words */
    units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    /* Array of tens as words */
    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    /* Array of scales as words */
    scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];

    /* Split user argument into 3 digit chunks from right to left */
    start = string.length;
    chunks = [];
    while (start > 0) {
      end = start;
      chunks.push(string.slice((start = Math.max(0, start - 3)), end));
    }

    /* Check if function has enough scale words to be able to stringify the user argument */
    chunksLen = chunks.length;
    if (chunksLen > scales.length) {
      return '';
    }

    /* Stringify each integer in each chunk */
    words = [];
    for (i = 0; i < chunksLen; i++) {

      chunk = parseInt(chunks[i]);

      if (chunk) {

        /* Split chunk into array of individual integers */
        ints = chunks[i].split('').reverse().map(parseFloat);

        /* If tens integer is 1, i.e. 10, then add 10 to units integer */
        if (ints[1] === 1) {
          ints[0] += 10;
        }

        /* Add scale word if chunk is not zero and array item exists */
        if ((word = scales[i])) {
          words.push(word);
        }

        /* Add unit word if array item exists */
        if ((word = units[ints[0]])) {
          words.push(word);
        }

        /* Add tens word if array item exists */
        if ((word = tens[ints[1]])) {
          words.push(word);
        }

        /* Add 'and' string after units or tens integer if: */
        if (ints[0] || ints[1]) {

          /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
          if (ints[2] || !i && chunksLen) {
            words.push(and);
          }

        }

        /* Add hundreds word if array item exists */
        if ((word = units[ints[2]])) {
          words.push(word + ' hundred');
        }

      }

    }

    return words.reverse().join(' ').toUpperCase() + " RUPEES";
  },
  htmlToExcelBlob(htmlContent: string): Blob {
    const table = document.createElement('table');
    table.innerHTML = htmlContent;

    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };

    return XLSX.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
  },
  excelSerialToDate(serial: number): Date {
    const utcDays = Math.floor(serial - EXCEL_DATE_OFFSET);
    const utcValue = utcDays * 86400; // Seconds in a day
    const dateInfo = new Date(utcValue * 1000);

    const fractionalDay = serial - Math.floor(serial) + 0.0000001;

    let totalSeconds = Math.floor(86400 * fractionalDay);
    const seconds = totalSeconds % 60;

    totalSeconds -= seconds;
    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor(totalSeconds / 60) % 60;

    dateInfo.setHours(hours, minutes, seconds, 0);

    return dateInfo;
  },
  tableToJsonForDoc(data) {
    var result = []; // result array without headers

    // go through cells 
    for (var i = 0; i < data.length; i++) {
      var tableRow = data[i];
      var rowData = [];

      for (var j = 0; j < tableRow.length; j++) {
        rowData.push(tableRow[j]);
      }
      result.push(rowData);
    }
    return result;
  },
  data2xlsxForDoc(options) {
    // For large datasets, process asynchronously to prevent UI blocking
    const data = this.tableToJsonForDoc(options.data);
    // Lower threshold to 500 rows for better responsiveness
    const isLargeDataset = data.length > 500;
    
    if (isLargeDataset) {
      // Process asynchronously for large datasets
      return this.data2xlsxForDocAsync(options, data);
    } else {
      // Process synchronously for small datasets
      return this.data2xlsxForDocSync(options, data);
    }
  },
  
  data2xlsxForDocSync(options, data) {
    const wb: XLSXStyle.WorkBook = XLSX.utils.book_new();
    
    // Do not filter columns; keep all columns for multi-level headers
    var ws = this.sheet_from_array_of_arraysForDoc(data, options.company, options.reportTitle, options.lineData, options.merges);

    /* add worksheet to workbook */
    wb.SheetNames.push(options.sheetName);
    wb.Sheets[options.sheetName] = ws;

    var wbout = XLSXStyle.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), options.filename);
  },
  
  data2xlsxForDocAsync(options, data) {
    return new Promise((resolve, reject) => {
      try {
        const wb: XLSXStyle.WorkBook = XLSX.utils.book_new();
        const ws = {};
        const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
        const colWidths = Array(data[0] ? data[0].length : 0).fill(0);

        // Add company name row at the beginning
        const companyNameRow = Array(data[0].length).fill('');
        companyNameRow[0] = options.company ? options.company.compName : "";
        data.unshift(companyNameRow);

        // Add report title row if it exists
        let insertRowIndex = 1;
        if (options.reportTitle) {
          const reportTitleRow = Array(data[0].length).fill('');
          reportTitleRow[0] = options.reportTitle;
          data.splice(insertRowIndex++, 0, reportTitleRow);
        }

        // Add each lineData row if it exists
        if (options.lineData && options.lineData.length > 0) {
          options.lineData.forEach(line => {
            const lineDataRow = Array(data[0].length).fill('');
            lineDataRow[0] = line;
            data.splice(insertRowIndex++, 0, lineDataRow);
          });
        }

        // Pre-calculate styles once and reuse
        const headerRowIndex = 2 + (options.lineData ? options.lineData.length : 0);
        const companyStyle = {
          font: { color: { rgb: "ffffff" }, bold: true, sz: 12 },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "8fce00" } },
          border: { top: { style: "thin" }, bottom: { style: "thin" } }
        };
        const reportTitleStyle = {
          font: { color: { rgb: "FF000000" }, bold: true, sz: 10 },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "ffffff" } },
          border: { top: { style: "thin" }, bottom: { style: "thin" } }
        };
        const lineDataStyle = {
          font: { color: { rgb: "FF000000" }, bold: true, sz: 10 },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "ffffff" } },
          border: { top: { style: "thin" }, bottom: { style: "thin" } }
        };
        const headerStyle = {
          font: { color: { rgb: "ffffff" }, bold: true, sz: 10 },
          border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
          alignment: { wrapText: false },
          fill: { fgColor: { rgb: "00afef" } }
        };
        const dataRowStyleEven = {
          font: { color: { rgb: "FF000000" }, sz: 8 },
          border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
          alignment: { wrapText: false },
          fill: { fgColor: { rgb: "cff2ff" } }
        };
        const dataRowStyleOdd = {
          font: { color: { rgb: "FF000000" }, sz: 8 },
          border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
          alignment: { wrapText: false },
          fill: { fgColor: { rgb: "ffffff" } }
        };
        const emptyCellStyleEven = { font: { sz: 8 }, fill: { fgColor: { rgb: "cff2ff" } } };
        const emptyCellStyleOdd = { font: { sz: 8 }, fill: { fgColor: { rgb: "ffffff" } } };

        const dataStartRow = headerRowIndex + 1;
        const totalRows = data.length;
        const totalCols = data[0] ? data[0].length : 0;

        range.s.r = 0;
        range.s.c = 0;
        range.e.r = totalRows - 1;
        range.e.c = totalCols - 1;

        // Use smaller chunk size for better responsiveness - 100 rows at a time
        const CHUNK_SIZE = 100;
        let processedRow = 0;

        // Helper function to determine cell type more efficiently
        const getCellTypeAndValue = (value) => {
          if (value == null || value === undefined) {
            return { v: '', t: 's' };
          }
          
          const type = typeof value;
          if (type === 'number') {
            return { v: value, t: 'n' };
          }
          if (type === 'boolean') {
            return { v: value, t: 'b' };
          }
          if (value instanceof Date) {
            return { v: value, t: 'n', z: XLSXStyle.SSF._table[14] };
          }
          if (type === 'string') {
            const cleaned = value.replace(/,/g, '');
            const numValue = Number(cleaned);
            if (!isNaN(numValue) && cleaned !== '') {
              return { v: numValue, t: 'n' };
            }
            return { v: value, t: 's' };
          }
          return { v: String(value), t: 's' };
        };

        const processChunk = () => {
          const endRow = Math.min(processedRow + CHUNK_SIZE, totalRows);
          
          for (let R = processedRow; R < endRow; R++) {
            const row = data[R];
            if (!row) continue;
            
            const isEvenRow = R % 2 === 0;
            const dataRowStyle = isEvenRow ? dataRowStyleEven : dataRowStyleOdd;
            const emptyCellStyle = isEvenRow ? emptyCellStyleEven : emptyCellStyleOdd;
            
            // Determine row style once per row
            let rowStyle;
            if (R === 0) {
              rowStyle = companyStyle;
            } else if (R === 1 && options.reportTitle) {
              rowStyle = reportTitleStyle;
            } else if (R >= 2 && R < headerRowIndex) {
              rowStyle = lineDataStyle;
            } else if (R === headerRowIndex) {
              rowStyle = headerStyle;
            } else {
              rowStyle = dataRowStyle;
            }

            const rowLength = row.length;
            
            // Process cells in the row
            for (let C = 0; C < rowLength; C++) {
              const cellInfo = getCellTypeAndValue(row[C]);
              const cell: any = { v: cellInfo.v, t: cellInfo.t };
              if (cellInfo.z) cell.z = cellInfo.z;

              // Calculate cell length for column width - only for data rows
              if (R >= dataStartRow) {
                const cellLength = cell.t === 'n' || cell.t === 'b' 
                  ? String(cell.v).length 
                  : (cell.v ? String(cell.v).length : 0);
                if (cellLength > colWidths[C]) {
                  colWidths[C] = Math.max(cellLength, 2);
                }
              }

              cell.s = rowStyle;
              const cell_ref = XLSXStyle.utils.encode_cell({ c: C, r: R });
              ws[cell_ref] = cell;
            }

            // Fill empty cells at end of row
            if (rowLength < totalCols) {
              for (let C = rowLength; C < totalCols; C++) {
                const cell_ref = XLSXStyle.utils.encode_cell({ c: C, r: R });
                ws[cell_ref] = { t: 's', v: '', s: emptyCellStyle };
              }
            }
          }

          processedRow = endRow;

          // Yield control back to browser to keep UI responsive
          if (processedRow < totalRows) {
            setTimeout(processChunk, 0);
          } else {
            // Finished processing all rows - now generate the file
            // Use setTimeout to yield before the expensive XLSX.write operation
            setTimeout(() => {
              try {
                if (range.s.c < 10000000) ws['!ref'] = XLSXStyle.utils.encode_range(range);
                ws['!cols'] = colWidths.map(width => ({ wch: Math.max(width, 10) }));

                // Set up merges
                ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }];
                if (options.reportTitle) {
                  ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } });
                }
                if (options.lineData && options.lineData.length > 0) {
                  for (let i = 0; i < options.lineData.length; i++) {
                    ws['!merges'].push({ s: { r: 2 + i, c: 0 }, e: { r: 2 + i, c: totalCols - 1 } });
                  }
                }
                if (options.merges && options.merges.length > 0) {
                  ws['!merges'].push(...options.merges);
                }

                wb.SheetNames.push(options.sheetName);
                wb.Sheets[options.sheetName] = ws;

                // XLSX.write can be slow for large files, yield again before this
                setTimeout(() => {
                  try {
                    const wbout = XLSXStyle.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
                    saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), options.filename);
                    resolve(null);
                  } catch (writeError) {
                    reject(writeError);
                  }
                }, 0);
              } catch (error) {
                reject(error);
              }
            }, 0);
          }
        };

        // Start processing with initial delay to allow UI to update
        setTimeout(processChunk, 0);
      } catch (error) {
        reject(error);
      }
    });
  }
};