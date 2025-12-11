export interface IDicMapping {
  [propertyName: string]: string;
}

export interface IDicMapping1 {
  [propertyName: string]: number;
}

const GeneralCustomTypes: IDicMapping = {
  "1": "",
};

const EmailTemplateType: IDicMapping = {
  "1": "Account Creation Email",
  "2": "Appointment Contact Email",
  "3": "Appointment Admin Email",
  "4": "Appointment Cancel Email",
  "5": "Appointment Reschedule Email",
  "6": "Contact Us Admin Email",
  "7": "Contact Us Contact Email",
  "8": "Appointment Confirm Email",
  "9": "Appointment Confirm Admin Email",
};

const MastervaluetypeObj: IDicMapping = {
  "1": "City",
  "2": "State",
  "3": "Country",
  "4": "Audit Remark",
  "5": "Idara Remark",
  "6": "Process Remark",
  "7": "Ticket Subject",
  "8": "Degree Courses",
  "9": "School/Institution",
  "10": "Standard",
};

const EnMastervaluetypeApplicantlistObj: IDicMapping = {
  "8": "Degree Courses",
  "9": "School/Institution",
  "10": "Standard",
};

const EnApplicationStatusTypeObj: IDicMapping = {
  "0": "Saved",
  "1": "Submitted",
  "2": "Received",
  "3": "Audited",
  "4": "In Manzuri",
  "5": "Ready For Sanctioned",
  "6": "Letter Printed",
  "7": "Paid",
  "8": "Dormant",
  "9": "Rejected",
  "10": "Follow Up",
  "11": "Bills Deleted",
};

const EnmonthsObj: IDicMapping = {
  Jan: "1",
  Feb: "2",
  Mar: "3",
  Apr: "4",
  May: "5",
  Jun: "6",
  Jul: "7",
  Aug: "8",
  Sep: "9",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

const EnRevmonthsObj: IDicMapping = {
  "1": "Jan",
  "2": "Feb",
  "3": "Mar",
  "4": "Apr",
  "5": "May",
  "6": "Jun",
  "7": "Jul",
  "8": "Aug",
  "9": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

const EnApplicationStatusForUserObj: IDicMapping = {
  "0": "Saved",
  "1": "Submitted",
  "2": "Received",
  "3": "Audited",
  "4": "Approved",
  "5": "Approved",
  "6": "Approved",
  "7": "Paid",
  "8": "Dormant ",
  "9": "Rejected ",
  "10": "Follow Up",
  "11": "Bills Deleted",
};

const EnCriteriaTypeObj: IDicMapping = {
  "1": "All Child",
  "2": "First Child",
  "3": "Second Child",
  "4": "Third Child",
  "5": "Fourth Child",
  "6": "Fifth Child",
  "7": "Sixth Child",
};

const EnGenderTypeObj: IDicMapping = {
  "1": "M",
  "2": "F",
};

const EnEducationTypeTypeObj: IDicMapping = {
  "1": "College",
  "2": "School",
};

const EnTicketStatusTypeObj: IDicMapping = {
  "1": "Pending",
  "2": "Replied",
};

const EnRoleObj: IDicMapping = {
  "1": "Super Admin",
  "2": "Admin",
  "3": "Auditor",
  "4": "Applicant",
  "5": "Receiver",
};

const EnTimeSlotsObj: IDicMapping = {
  "1": "15 Mins",
  "2": "30 Mins",
  "3": "45 Mins",
  "4": "1 Hour",
};

const EnWeekDaysObj: IDicMapping = {
  "0": "Sunday",
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday",
};

const EnDepartmentTypeObj: IDicMapping = {
  "1": "Category A",
  "2": "Category B",
};

const EnAppointmentStatusObj: IDicMapping = {
  "1": "Pending Request",
  "2": "Booked",
  "3": "Rescheduled",
  "4": "Cancelled",
  "5": "Archived",
};

// Jamiyat constants - Currently only Poona exists
export class Jamiyat {
  static readonly Poona = 1;

  static getJamiyatText(jamiyatId: number | null | undefined): string {
    switch (jamiyatId) {
      case Jamiyat.Poona:
        return "Poona";
      default:
        return "Unknown";
    }
  }

  static getJamiyatId(jamiyatText: string | null | undefined): number | null {
    switch (jamiyatText?.trim()) {
      case "Poona":
        return Jamiyat.Poona;
      default:
        return null;
    }
  }
}

// Jamaat constants for different Jamaats in Poona
export class Jamaat {
  static readonly Baramati = 1;
  static readonly FakhriMohalla = 2;
  static readonly ZainiMohalla = 3;
  static readonly KalimiMohalla = 4;
  static readonly Ahmednagar = 5;
  static readonly ImadiMohalla = 6;
  static readonly Kasarwadi = 7;
  static readonly Khadki = 8;
  static readonly Lonavala = 9;
  static readonly MufaddalMohalla = 10;
  static readonly Poona = 11;
  static readonly SaifeeMohallah = 12;
  static readonly TaiyebiMohalla = 13;
  static readonly FatemiMohalla = 14;

  static getJamaatText(jamaatId: number | null | undefined): string {
    switch (jamaatId) {
      case Jamaat.Baramati:
        return "BARAMATI";
      case Jamaat.FakhriMohalla:
        return "FAKHRI MOHALLA (POONA)";
      case Jamaat.ZainiMohalla:
        return "ZAINI MOHALLA (POONA)";
      case Jamaat.KalimiMohalla:
        return "KALIMI MOHALLA (POONA)";
      case Jamaat.Ahmednagar:
        return "AHMEDNAGAR";
      case Jamaat.ImadiMohalla:
        return "IMADI MOHALLA (POONA)";
      case Jamaat.Kasarwadi:
        return "KASARWADI";
      case Jamaat.Khadki:
        return "KHADKI (POONA)";
      case Jamaat.Lonavala:
        return "LONAVALA";
      case Jamaat.MufaddalMohalla:
        return "MUFADDAL MOHALLA (POONA)";
      case Jamaat.Poona:
        return "POONA";
      case Jamaat.SaifeeMohallah:
        return "SAIFEE MOHALLAH (POONA)";
      case Jamaat.TaiyebiMohalla:
        return "TAIYEBI MOHALLA (POONA)";
      case Jamaat.FatemiMohalla:
        return "FATEMI MOHALLA (POONA)";
      default:
        return "Unknown";
    }
  }

  static getJamaatId(jamaatText: string | null | undefined): number | null {
    switch (jamaatText?.trim()) {
      case "BARAMATI":
        return Jamaat.Baramati;
      case "FAKHRI MOHALLA (POONA)":
        return Jamaat.FakhriMohalla;
      case "ZAINI MOHALLA (POONA)":
        return Jamaat.ZainiMohalla;
      case "KALIMI MOHALLA (POONA)":
        return Jamaat.KalimiMohalla;
      case "AHMEDNAGAR":
        return Jamaat.Ahmednagar;
      case "IMADI MOHALLA (POONA)":
        return Jamaat.ImadiMohalla;
      case "KASARWADI":
        return Jamaat.Kasarwadi;
      case "KHADKI (POONA)":
        return Jamaat.Khadki;
      case "LONAVALA":
        return Jamaat.Lonavala;
      case "MUFADDAL MOHALLA (POONA)":
        return Jamaat.MufaddalMohalla;
      case "POONA":
        return Jamaat.Poona;
      case "SAIFEE MOHALLAH (POONA)":
        return Jamaat.SaifeeMohallah;
      case "TAIYEBI MOHALLA (POONA)":
        return Jamaat.TaiyebiMohalla;
      case "FATEMI MOHALLA (POONA)":
        return Jamaat.FatemiMohalla;
      default:
        return null;
    }
  }

  static readonly jamaatList = [
    { text: "BARAMATI", id: 1 },
    { text: "FAKHRI MOHALLA (POONA)", id: 2 },
    { text: "ZAINI MOHALLA (POONA)", id: 3 },
    { text: "KALIMI MOHALLA (POONA)", id: 4 },
    { text: "AHMEDNAGAR", id: 5 },
    { text: "IMADI MOHALLA (POONA)", id: 6 },
    { text: "KASARWADI", id: 7 },
    { text: "KHADKI (POONA)", id: 8 },
    { text: "LONAVALA", id: 9 },
    { text: "MUFADDAL MOHALLA (POONA)", id: 10 },
    { text: "POONA", id: 11 },
    { text: "SAIFEE MOHALLAH (POONA)", id: 12 },
    { text: "TAIYEBI MOHALLA (POONA)", id: 13 },
    { text: "FATEMI MOHALLA (POONA)", id: 14 },
  ];
}

export const appCommon = {
  LocalStorageKeyType: {
    TokenInfo: "tokenInfo",
    ApplicationData: "applicationData",
    UserData: "userData",
    Otp: "otp",
    Email: "email",
    DashBoardParameter: "dashBoardParameter",
    CoveringData: "coveringData",
    ManzuriData: "manzuriData",
    CashbookData: "cashbookData",
    UserLoginDetail: "userLoginDetail",
  },

  EnMartialStatusType: [
    { text: "Married ", id: 1 },
    { text: "Single", id: 2 },
  ],

  EnGenderType: [
    { text: "M", id: 1 },
    { text: "F", id: 2 },
  ],

  EnGenderTypeObj: EnGenderTypeObj,

  EnEducationTypeType: [
    { text: "College ", id: 1 },
    { text: "School ", id: 2 },
  ],

  EnEducationTypeTypeObj: EnEducationTypeTypeObj,

  EnTicketStatusType: [
    { text: "Pending", id: 1 },
    { text: "Replied", id: 2 },
  ],

  EnTicketStatusTypeObj: EnTicketStatusTypeObj,

  EnApplicationStatusType: [
    { text: "Saved", id: 0 },
    { text: "Submitted", id: 1 },
    { text: "Received", id: 2 },
    { text: "Audited", id: 3 },
    { text: "In Manzuri", id: 4 },
    { text: "Ready For Sanctioned", id: 5 },
    { text: "Letter Printed", id: 6 },
    { text: "Paid", id: 7 },
    { text: "Dormant", id: 8 },
    { text: "Rejected", id: 9 },
    { text: "Follow Up", id: 10 },
    { text: "Bills Deleted", id: 11 },
  ],

  EnApplicationStatusForReport: [
    { text: "Scan & Received", id: 2 },
    { text: "Audited", id: 3 },
    { text: "Approved", id: 4 },
    { text: "Print Letter", id: 6 },
    { text: "Idara Amount Revised", id: 0 },
  ],

  EnApplicationStatusTypeObj: EnApplicationStatusTypeObj,

  EnApplicationStatusForUser: [
    { text: "Saved", id: 0 },
    { text: "Submitted", id: 1 },
    { text: "Received", id: 2 },
    { text: "Audited", id: 3 },
    { text: "Approved", id: 4 },
    { text: "Approved", id: 5 },
    { text: "Approved", id: 6 },
    { text: "Paid", id: 7 },
    { text: "Dormant", id: 8 },
    { text: "Rejected", id: 9 },
    { text: "Follow Up", id: 10 },
    { text: "Bills Deleted", id: 11 },
  ],

  EnApplicationStatusForUserObj: EnApplicationStatusForUserObj,

  EnApplicationUserStatus: [
    { text: "Saved", id: 1 },
    { text: "Submitted", id: 2 },
    { text: "Received", id: 3 },
    { text: "Paid", id: 4 },
  ],

  EnCriteriaTypeObj: EnCriteriaTypeObj,

  EnCriteriaType: [
    { text: "All Child", id: 1 },
    { text: "First Child", id: 2 },
    { text: "Second Child", id: 3 },
    { text: "Third Child", id: 4 },
    { text: "Fourth Child", id: 5 },
    { text: "Fifth Child", id: 6 },
    { text: "Sixth Child", id: 7 },
  ],

  EnRole: [
    { text: "Super Admin", id: 1 },
    { text: "Admin", id: 2 },
    { text: "Auditor", id: 3 },
    { text: "Applicant", id: 4 },
    { text: "Receiver", id: 5 },
  ],

  EnFilterType: [
    { text: "All", id: null },
    { text: "Pending", id: false },
    { text: "Approved", id: true },
  ],

  EnApplicantType: [
    // { text: 'All', id: null },
    //{ text: 'ITS Users', id: 1 },
    { text: "Employees", id: 2 },
  ],

  EnApplicantTypeAll: [
    { text: "All", id: null },
    { text: "ITS Users", id: 1 },
    { text: "Employees", id: 2 },
  ],

  EnTimeSlots: [
    { text: "15 Mins", id: 1 },
    { text: "30 Mins", id: 2 },
    { text: "45 Mins", id: 3 },
    { text: "1 Hour", id: 4 },
  ],

  EnTimeSlotsObj: EnTimeSlotsObj,

  EnWeekDays: [
    { text: "Sunday", id: 0 },
    { text: "Monday", id: 1 },
    { text: "Tuesday", id: 2 },
    { text: "Wednesday", id: 3 },
    { text: "Thursday", id: 4 },
    { text: "Friday", id: 5 },
    { text: "Saturday", id: 6 },
  ],

  EnWeekDaysObj: EnWeekDaysObj,

  EnRoleType: [
    { text: "Super Admin", id: 1 },
    { text: "Admin", id: 2 },
    { text: "Auditor", id: 3 },
    { text: "Applicant", id: 4 },
    { text: "Receiver", id: 5 },
  ],

  EnRoleForAdmin: [
    { text: "Super Admin", id: 1 },
    { text: "Admin", id: 2 },
    { text: "Auditor", id: 3 },
    { text: "Receiver", id: 5 },
  ],

  EnRoleObj: EnRoleObj,

  EnMastervaluetypelist: [
    { text: "City", id: 1 },
    { text: "State", id: 2 },
    { text: "Country", id: 3 },
    { text: "Audit Remark", id: 4 },
    { text: "Idara Remark", id: 5 },
    { text: "Process Remark", id: 6 },
    { text: "Ticket Subject", id: 7 },
    { text: "Degree Courses", id: 8 },
    { text: "School/Institution", id: 9 },
    { text: "Standard", id: 10 },
  ],
  MastervaluetypeObj: MastervaluetypeObj,

  EnMastervaluetypeApplicantlist: [
    { text: "Degree Courses", id: 8 },
    { text: "School/Institution", id: 9 },
    { text: "Standard", id: 10 },
  ],

  EnMastervaluetypeApplicantlistObj: EnMastervaluetypeApplicantlistObj,

  ReportOutputOptionType: [
    { text: "View", id: 1 },
    // { text: 'Export To CSV', id: 2 },
    { text: "Export To Excel", id: 3 },
    // { text: 'Export To PDF', id: 4 },
    // { text: 'Print', id: 5 }
  ],

  CustomMessageType: [{ id: 1, text: "" }],

  EmailTemplateTypes: [
    { id: 1, text: "Account Creation Email" },
    { id: 2, text: "Appointment Contact Email" },
    { id: 3, text: "Appointment Admin Email" },
    { id: 4, text: "Appointment Cancel Email" },
    { id: 5, text: "Appointment Reschedule Email" },
    { id: 6, text: "Contact Us Admin Email" },
    { id: 7, text: "Contact Us Contact Email" },
    { id: 8, text: "Appointment Confirm Email" },
    { id: 9, text: "Appointment Confirm Admin Email" },
  ],

  EnDepartmentType: [
    { text: "Category A", id: 1 },
    { text: "Category B", id: 2 },
  ],

  EnAppointmentStatus: [
    { text: "Pending Request", id: 1 },
    { text: "Booked", id: 2 },
    { text: "Rescheduled", id: 3 },
    { text: "Cancelled", id: 4 },
    { text: "Archived", id: 5 },
  ],

  EnAppointmentStatusObj: EnAppointmentStatusObj,

  EnDepartmentTypeObj: EnDepartmentTypeObj,

  // CMS and Blog related enums
  EnMediaType: [
    { text: "Image", id: "Image" },
    { text: "Video", id: "Video" },
    { text: "Document", id: "Document" },
    //{ text: 'Other', id: 'Other' }
  ],

  EnMediaTypeObj: {
    Image: "Image",
    Video: "Video",
    Document: "Document",
    //"Other": "Other"
  },

  EnContentType: [
    { text: "Blog", id: "Blog" },
    { text: "Article", id: "Article" },
    { text: "Case Study", id: "CaseStudy" },
  ],

  EnContentTypeObj: {
    Blog: "Blog",
    Article: "Article",
    CaseStudy: "Case Study",
  },

  EnBlogStatus: [
    { text: "Draft", id: "Draft" },
    { text: "Published", id: "Published" },
    { text: "Scheduled", id: "Scheduled" },
    { text: "Archived", id: "Archived" },
  ],

  EnBlogStatusObj: {
    Draft: "Draft",
    Published: "Published",
    Scheduled: "Scheduled",
    Archived: "Archived",
  },

  EnVisibility: [
    { text: "Public", id: "Public" },
    { text: "Private", id: "Private" },
  ],

  EnVisibilityObj: {
    Public: "Public",
    Private: "Private",
  },

  EnPermissionTextList: [
    { text: "View", id: 1 },
    { text: "List", id: 2 },
    { text: "Add", id: 3 },
    { text: "Print/Export", id: 4 },
    // { text: 'Edit Own', id: 5 },
    { text: "Edit", id: 6 },
    // { text: 'Delete Own', id: 7 },
    { text: "Delete", id: 8 },
  ],

  EnPermissionModuleList: [
    { section: "System", text: "User", id: 1 },
    { section: "System", text: "Roles", id: 2 },
    { section: "System", text: "Permission", id: 3 },
    { section: "Administration", text: "Masters", id: 4 },
    { section: "Applicant", text: "Application", id: 5 },
    { section: "Administration", text: "Application Period", id: 6 },
    { section: "Applicant", text: "Bank Details", id: 7 },
    { section: "Administration", text: "Receipt Discription", id: 8 },
    { section: "Administration", text: "Department", id: 9 },
    { section: "Applicant", text: "Family Member", id: 10 },
    { section: "Administration", text: "Ifsc Code", id: 11 },
    { section: "Administration", text: "Relation", id: 12 },
    { section: "Applicant", text: "Applicant Profile", id: 13 },
    { section: "Administration", text: "Application Batch", id: 14 },
    { section: "Administration", text: "Application Criteria", id: 15 },
    { section: "Applicant", text: "Child Academic Details", id: 16 },
    { section: "Administration", text: "Custom Message", id: 17 },
    { section: "Administration", text: "Email Setting", id: 18 },
    { section: "Administration", text: "Email Template", id: 19 },
    { section: "Administration", text: "Notification", id: 20 },
    { section: "Administration", text: "Ticket", id: 21 },
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
    { Id: 12, Text: "December", Sort: "Dec" },
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
    var a = [
      "",
      "one ",
      "two ",
      "three ",
      "four ",
      "five ",
      "six ",
      "seven ",
      "eight ",
      "nine ",
      "ten ",
      "eleven ",
      "twelve ",
      "thirteen ",
      "fourteen ",
      "fifteen ",
      "sixteen ",
      "seventeen ",
      "eighteen ",
      "nineteen ",
    ];
    var b = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];
    if ((num = num.toString()).length > 9) return "overflow";
    var n: any = ("000000000" + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = "";
    str +=
      n[1] != 0
        ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
        : "";
    str +=
      n[2] != 0
        ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
        : "";
    str +=
      n[3] != 0
        ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
        : "";
    str +=
      n[4] != 0
        ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
        : "";
    str +=
      n[5] != 0
        ? (str != "" ? "and " : "") +
          (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
          "only "
        : "";
    return str.toUpperCase();
  },

  EnGeneralCustomTypes: GeneralCustomTypes,
  EnEmailTemplateType: EmailTemplateType,

  FormatValueBasedOnPrecision(num: Number, isCurrency = true) {
    if (num != null) {
      var options: any = { minimumFractionDigits: 2 };
      if (isCurrency) {
        options.style = "currency";
        options.currency = "INR";
      }

      return Number(num.toString().replace(/,/g, "")).toLocaleString(
        "en-IN",
        options
      );
    } else {
      return "";
    }
  },

  getAge(dob: string): string {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return ` (age ${age - 1})`;
    }
    return ` (age ${age})`;
  },
};
