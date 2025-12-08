export interface IDicMapping {
  [propertyName: string]: string;
}

export interface IDicMapping1 {
  [propertyName: string]: number;
}

const GeneralCustomTypes: IDicMapping = {
  //"1": "New Appllication Admin Text",
  "2": "New Appllication Applicant Text",
  //"3": "Appllication Recevied Admin Text",
  "4": "Appllication Recevied Applicant Text",
  //"5": "Appllication Paid Admin Text",
  "6": "Appllication Paid Applicant Text",
  "7": "New Ticket Receiver Text",
  "8": "New Ticket Applicant Text",
  "9": "Ticket Replied Text",
  "10": "New Entry Admin Text",
  "11": "New Entry Applicant Text",
  "12": "New Entry Approved Applicant Text",
  //"13": "New Bank Details Added Admin Text",
  //"14": "Bank Details Verified Applicant Text",
  "15": "Family Member Verified Applicant Text",
  "16": "New Family Member Admin Text",
  "17": "Appllication Marked Followup Applicant Text",
  "18": "Appllication Marked Followup Complete Applicant Text",
  "19": "Appllication Rejected Applicant Text",
  "20": "New Profile Approved Applicant Text",
  "21": "Application Reopen Applicant Text",
  "22": "Child Academic Details Updated Applicant Text",
}

const EmailTemplateType: IDicMapping = {
  //"1": "New Appllication Admin Email",
  "2": "New Appllication Applicant Email",
  //"3": "Appllication Recevied Admin Email",
  "4": "Appllication Recevied Applicant Email",
  //"5": "Appllication Paid Admin Email",
  "6": "Appllication Paid Applicant Email",
  "7": "New Ticket Receiver Email",
  "8": "New Ticket Applicant Email",
  "9": "Ticket Replied Email",
  "10": "New Entry Admin Email",
  "11": "New Entry Applicant Email",
  "12": "New Entry Approved Applicant Email",
  //"13": "New Bank Details Added Admin Email",
  //"14": "Bank Details Verified Applicant Email",
  "15": "Family Member Verified Applicant Email",
  "16": "Forgot Password Email",
  "17": "New Family Member Admin Email",
  "18": "Appllication Marked Followup Applicant Email",
  "19": "Appllication Marked Followup Complete Applicant Email",
  "20": "Appllication Rejected Applicant Email",
  "21": "New Profile Approved Applicant Email",
  "22": "Application Reopen Applicant Email",
  "23": "Child Academic Details Updated Applicant Email",
}

const MastervaluetypeObj: IDicMapping = {
  "1": "City",
  "2": 'State',
  "3": 'Country',
  "4": 'Audit Remark',
  "5": 'Idara Remark',
  "6": 'Process Remark',
  "7": 'Ticket Subject',
  "8": 'Degree Courses',
  "9": 'School/Institution',
  "10": 'Standard'
}

const EnMastervaluetypeApplicantlistObj: IDicMapping = {
  "8": 'Degree Courses',
  "9": 'School/Institution',
  "10": 'Standard'
}

const EnApplicationStatusTypeObj: IDicMapping = {
  "0": "Saved",
  "1": "Submitted",
  "2": 'Received',
  "3": 'Audited',
  "4": 'In Manzuri',
  "5": 'Ready For Sanctioned',
  "6": 'Letter Printed',
  "7": 'Paid',
  "8": 'Dormant',
  "9": 'Rejected',
  "10": 'Follow Up',
  "11": 'Bills Deleted',
}

const EnmonthsObj: IDicMapping = {
  "Jan": "1",
  "Feb": "2",
  "Mar": '3',
  "Apr": '4',
  "May": '5',
  "Jun": '6',
  "Jul": '7',
  "Aug": '8',
  "Sep": '9',
  "Oct": '10',
  "Nov": '11',
  "Dec": '12',
}

const EnRevmonthsObj: IDicMapping = {
  "1": "Jan",
  "2": "Feb",
  '3': "Mar",
  '4': "Apr",
  '5': "May",
  '6': "Jun",
  '7': "Jul",
  '8': "Aug",
  '9': "Sep",
  '10': "Oct",
  '11': "Nov",
  '12': "Dec",
}

const EnApplicationStatusForUserObj: IDicMapping = {
  "0": "Saved",
  "1": "Submitted",
  "2": 'Received',
  "3": 'Audited',
  "4": 'Approved',
  "5": 'Approved',
  "6": 'Approved',
  "7": 'Paid',
  "8": 'Dormant ',
  "9": 'Rejected ',
  "10": 'Follow Up',
  "11": 'Bills Deleted',
}

const EnCriteriaTypeObj: IDicMapping = {
  "1": "All Child",
  "2": 'First Child',
  "3": 'Second Child',
  "4": 'Third Child',
  "5": 'Fourth Child',
  "6": 'Fifth Child',
  "7": 'Sixth Child',
}

const EnGenderTypeObj: IDicMapping = {
  "1": "M",
  "2": 'F',
}

const EnEducationTypeTypeObj: IDicMapping = {
  "1": "College",
  "2": 'School',
}

const EnTicketStatusTypeObj: IDicMapping = {
  "1": "Pending",
  "2": 'Replied',
}

const EnRoleObj: IDicMapping = {
  "1": "Super Admin",
  "2": 'Admin',
  "3": 'Auditor',
  "4": 'Applicant',
  "5": 'Receiver'
}

const EnDepartmentTypeObj: IDicMapping = {
  "1": "Category A",
  "2": 'Category B',
}

export const appCommon = {

  LocalStorageKeyType: {
    TokenInfo: 'tokenInfo',
    ApplicationData: 'applicationData',
    UserData: 'userData',
    Otp: 'otp',
    Email: 'email',
    DashBoardParameter: 'dashBoardParameter',
    CoveringData: 'coveringData',
    ManzuriData: 'manzuriData',
    CashbookData: 'cashbookData',
  },

  EnMartialStatusType: [
    { text: 'Married ', id: 1 },
    { text: 'Single', id: 2 },
  ],

  EnGenderType: [
    { text: 'M', id: 1 },
    { text: 'F', id: 2 },
  ],

  EnGenderTypeObj: EnGenderTypeObj,

  EnEducationTypeType: [
    { text: 'College ', id: 1 },
    { text: 'School ', id: 2 },
  ],

  EnEducationTypeTypeObj: EnEducationTypeTypeObj,

  EnTicketStatusType: [
    { text: 'Pending', id: 1 },
    { text: 'Replied', id: 2 },
  ],

  EnTicketStatusTypeObj: EnTicketStatusTypeObj,

  EnApplicationStatusType: [
    { text: 'Saved', id: 0 },
    { text: 'Submitted', id: 1 },
    { text: 'Received', id: 2 },
    { text: 'Audited', id: 3 },
    { text: 'In Manzuri', id: 4 },
    { text: 'Ready For Sanctioned', id: 5 },
    { text: 'Letter Printed', id: 6 },
    { text: 'Paid', id: 7 },
    { text: 'Dormant', id: 8 },
    { text: 'Rejected', id: 9 },
    { text: 'Follow Up', id: 10 },
    { text: "Bills Deleted", id: 11 }
  ],

  EnApplicationStatusForReport: [
    { text: 'Scan & Received', id: 2 },
    { text: 'Audited', id: 3 },
    { text: 'Approved', id: 4 },
    { text: 'Print Letter', id: 6 },
    { text: 'Idara Amount Revised', id: 0 },
  ],

  EnApplicationStatusTypeObj: EnApplicationStatusTypeObj,

  EnApplicationStatusForUser: [
    { text: 'Saved', id: 0 },
    { text: 'Submitted', id: 1 },
    { text: 'Received', id: 2 },
    { text: 'Audited', id: 3 },
    { text: 'Approved', id: 4 },
    { text: 'Approved', id: 5 },
    { text: 'Approved', id: 6 },
    { text: 'Paid', id: 7 },
    { text: 'Dormant', id: 8 },
    { text: 'Rejected', id: 9 },
    { text: 'Follow Up', id: 10 },
    { text: "Bills Deleted", id: 11 }
  ],

  EnApplicationStatusForUserObj: EnApplicationStatusForUserObj,

  EnApplicationUserStatus: [
    { text: 'Saved', id: 1 },
    { text: 'Submitted', id: 2 },
    { text: 'Received', id: 3 },
    { text: 'Paid', id: 4 },
  ],

  EnCriteriaTypeObj: EnCriteriaTypeObj,

  EnCriteriaType: [
    { text: 'All Child', id: 1 },
    { text: 'First Child', id: 2 },
    { text: 'Second Child', id: 3 },
    { text: 'Third Child', id: 4 },
    { text: 'Fourth Child', id: 5 },
    { text: 'Fifth Child', id: 6 },
    { text: 'Sixth Child', id: 7 },
  ],

  EnRole: [
    { text: 'Super Admin', id: 1 },
    { text: 'Admin', id: 2 },
    { text: 'Auditor', id: 3 },
    { text: 'Applicant', id: 4 },
    { text: 'Receiver', id: 5 }
  ],

  EnFilterType: [
    { text: 'All', id: null },
    { text: 'Pending', id: false },
    { text: 'Approved', id: true },
  ],

  EnApplicantType: [
    // { text: 'All', id: null },
    //{ text: 'ITS Users', id: 1 },
    { text: 'Employees', id: 2 },
  ],

  EnApplicantTypeAll: [
    { text: 'All', id: null },
    { text: 'ITS Users', id: 1 },
    { text: 'Employees', id: 2 },
  ],

  EnRoleType: [
    { text: 'Super Admin', id: 1 },
    { text: 'Admin', id: 2 },
    { text: 'Auditor', id: 3 },
    { text: 'Applicant', id: 4 },
    { text: 'Receiver', id: 5 }
  ],

  EnRoleForAdmin: [
    { text: 'Super Admin', id: 1 },
    { text: 'Admin', id: 2 },
    { text: 'Auditor', id: 3 },
    { text: 'Receiver', id: 5 }
  ],

  EnRoleObj: EnRoleObj,

  EnMastervaluetypelist: [
    { text: 'City', id: 1 },
    { text: 'State', id: 2 },
    { text: 'Country', id: 3 },
    { text: 'Audit Remark', id: 4 },
    { text: 'Idara Remark', id: 5 },
    { text: 'Process Remark', id: 6 },
    { text: 'Ticket Subject', id: 7 },
    { text: 'Degree Courses', id: 8 },
    { text: 'School/Institution', id: 9 },
    { text: 'Standard', id: 10 },
  ],
  MastervaluetypeObj: MastervaluetypeObj,

  EnMastervaluetypeApplicantlist: [
    { text: 'Degree Courses', id: 8 },
    { text: 'School/Institution', id: 9 },
    { text: 'Standard', id: 10 },
  ],

  EnMastervaluetypeApplicantlistObj: EnMastervaluetypeApplicantlistObj,

  ReportOutputOptionType: [
    { text: 'View', id: 1 },
    // { text: 'Export To CSV', id: 2 },
    { text: 'Export To Excel', id: 3 },
    // { text: 'Export To PDF', id: 4 },
    // { text: 'Print', id: 5 }
  ],

  CustomMessageType: [
    //{ id: 1, text: 'New Appllication Admin Text' },
    { id: 2, text: 'New Appllication Applicant Text' },
    //{ id: 3, text: 'Appllication Recevied Admin Text' },
    { id: 4, text: 'Appllication Recevied Applicant Text' },
    //{ id: 5, text: 'Appllication Paid Admin Text' },
    { id: 6, text: 'Appllication Paid Applicant Text' },
    { id: 7, text: 'New Ticket Receiver Text' },
    { id: 8, text: 'New Ticket Applicant Text' },
    { id: 9, text: 'Ticket Replied Text' },
    { id: 10, text: 'New Entry Admin Text' },
    { id: 11, text: 'New Entry Applicant Text' },
    { id: 12, text: 'New Entry Approved Applicant Text' },
    //{ id: 13, text: 'New Bank Details Added Admin Text' },
    //{ id: 14, text: 'Bank Details Verified Applicant Text' },
    { id: 15, text: 'Family Member Verified Applicant Text' },
    { id: 16, text: 'New Family Member Admin Text' },
    { id: 17, text: 'Appllication Marked Followup Applicant Text' },
    { id: 18, text: 'Appllication Marked Followup Complete Applicant Text' },
    { id: 19, text: 'Appllication Rejected Applicant Text' },
    { id: 20, text: 'New Profile Approved Applicant Text' },
    { id: 21, text: 'Application Reopen Applicant Text' },
    { id: 22, text: 'Child Academic Details Updated Applicant Text' },
  ],

  EmailTemplateTypes: [
    //{ id: 1, text: 'New Appllication Admin Email' },
    { id: 2, text: 'New Appllication Applicant Email' },
    //{ id: 3, text: 'Appllication Recevied Admin Email' },
    { id: 4, text: 'Appllication Recevied Applicant Email' },
    //{ id: 5, text: 'Appllication Paid Admin Email' },
    { id: 6, text: 'Appllication Paid Applicant Email' },
    { id: 7, text: 'New Ticket Receiver Email' },
    { id: 8, text: 'New Ticket Applicant Email' },
    { id: 9, text: 'Ticket Replied Email' },
    { id: 10, text: 'New Entry Admin Email' },
    { id: 11, text: 'New Entry Applicant Email' },
    { id: 12, text: 'New Entry Approved Applicant Email' },
    //{ id: 13, text: 'New Bank Details Added Admin Email' },
    //{ id: 14, text: 'Bank Details Verified Applicant Email' },
    { id: 15, text: 'Family Member Verified Applicant Email' },
    { id: 16, text: 'Forgot Password Email' },
    { id: 17, text: 'New Family Member Admin Email' },
    { id: 18, text: 'Appllication Marked Followup Applicant Email' },
    { id: 19, text: 'Appllication Marked Followup Complete Applicant Email' },
    { id: 20, text: 'Appllication Rejected Applicant Email' },
    { id: 21, text: 'New Profile Approved Applicant Email' },
    { id: 22, text: 'Application Reopen Applicant Email' },
    { id: 23, text: 'Child Academic Details Updated Applicant Email' },
  ],

  EnDepartmentType: [
    { text: 'Category A', id: 1 },
    { text: 'Category B', id: 2 },
  ],

  EnDepartmentTypeObj: EnDepartmentTypeObj,

  EnPermissionTextList: [
    { text: 'View', id: 1 },
    { text: 'List', id: 2 },
    { text: 'Add', id: 3 },
    { text: 'Print/Export', id: 4 },
    // { text: 'Edit Own', id: 5 },
    { text: 'Edit', id: 6 },
    // { text: 'Delete Own', id: 7 },
    { text: 'Delete', id: 8 },
  ],

  EnPermissionModuleList: [
    { section: 'System', text: 'User', id: 1 },
    { section: 'System', text: 'Roles', id: 2 },
    { section: 'System', text: 'Permission', id: 3 },
    { section: 'Administration', text: 'Masters', id: 4 },
    { section: 'Applicant', text: 'Application', id: 5 },
    { section: 'Administration', text: 'Application Period', id: 6 },
    { section: 'Applicant', text: 'Bank Details', id: 7 },
    { section: 'Administration', text: 'Receipt Discription', id: 8 },
    { section: 'Administration', text: 'Department', id: 9 },
    { section: 'Applicant', text: 'Family Member', id: 10 },
    { section: 'Administration', text: 'Ifsc Code', id: 11 },
    { section: 'Administration', text: 'Relation', id: 12 },
    { section: 'Applicant', text: 'Applicant Profile', id: 13 },
    { section: 'Administration', text: 'Application Batch', id: 14 },
    { section: 'Administration', text: 'Application Criteria', id: 15 },
    { section: 'Applicant', text: 'Child Academic Details', id: 16 },
    { section: 'Administration', text: 'Custom Message', id: 17 },
    { section: 'Administration', text: 'Email Setting', id: 18 },
    { section: 'Administration', text: 'Email Template', id: 19 },
    { section: 'Administration', text: 'Notification', id: 20 },
    { section: 'Administration', text: 'Ticket', id: 21 }
  ],

  Months: [
    { Id: 1, Text: "January", Sort: "Jan" },
    { Id: 2, Text: "February", Sort: "Feb" },
    { Id: 3, Text: "March", Sort: "Mar" },
    { Id: 4, Text: "April", Sort: "Apr" },
    { Id: 5, Text: "May", Sort: "May" },
    { Id: 6, Text: "June", Sort: "Jun" },
    { Id: 7, Text: "July", Sort: "Jul" },
    { Id: 8, Text: "August", Sort: "Aug" },
    { Id: 9, Text: "September", Sort: "Sep" },
    { Id: 10, Text: "October", Sort: "Oct" },
    { Id: 11, Text: "November", Sort: "Nov" },
    { Id: 12, Text: "December", Sort: "Dec" }
  ],

  EnmonthsObj: EnmonthsObj,
  EnRevmonthsObj: EnRevmonthsObj,
  GridRowHeight: 35,
  GridHeightPer: 0.59,

  calculateIndexNo(list) {
    var sno = 1;
    list.forEach((v: any) => {
      v.sno = sno;
      sno = sno + 1;
    });
  },

  numberToEnglish(num) {
    var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    var n: any = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str.toUpperCase();
  },

  EnGeneralCustomTypes: GeneralCustomTypes,
  EnEmailTemplateType: EmailTemplateType,

  FormatValueBasedOnPrecision(num: Number, isCurrency = true) {

    if (num != null) {
      var options: any = { minimumFractionDigits: 2 };
      if (isCurrency) {
        options.style = 'currency';
        options.currency = 'INR'
      }

      return Number(num.toString().replace(/,/g, '')).toLocaleString('en-IN', options)
    }
    else {
      return '';
    }
  },

  replaceArabicString(item): string { return item.replace(/صاحب/g, "").replace(/</g, "بهائي").replace(/>/g, "بهائي") }
};