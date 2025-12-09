window.APP_CONFIG = {
  // Tenant configuration based on URL
  tenants: {
    // localhost: {
    //   tenantId: 4,
    //   companyCode: "mapledental",
    //   companyName: "Maple Dental",
    //   logo: "assets/images/mapledental/logo-dark.png",
    //   title: "Maple Dental Admin",
    // },
    "admin.mapledentalpa.com": {
      tenantId: 4,
      companyCode: "mapledental",
      companyName: "Maple Dental",
      logo: "assets/images/mapledental/logo-dark.png",
      title: "Maple Dental Admin",
    },
    "admin.tulipdentalnj.com": {
      tenantId: 6,
      companyCode: "tulipdental",
      companyName: "Tulip Dental",
      logo: "assets/images/tulipdental/logo-dark.png",
      title: "Tulip Dental Admin",
    },
    "admin.urbandentalnj.com": {
      tenantId: 5,
      companyCode: "urbandental",
      companyName: "Urban Dental",
      logo: "assets/images/urbandental/logo-dark.png",
      title: "Urban Dental Admin",
    },
    "admin.capitolsmilesnj.com": {
      tenantId: 7,
      companyCode: "capitoldental",
      companyName: "Capitol Smiles Dental",
      logo: "assets/images/capitoldental/logo-dark.png",
      title: "Capitol Smiles Dental Admin",
    },
    "admin.communitysmilesnj.com": {
      tenantId: 8,
      companyCode: "communitysmiles",
      companyName: "Community Smiles",
      logo: "assets/images/communitysmiles/Community Smiles Logo header.png",
      title: "Community Smiles Admin",
    },
    "admin.smilingmolar.com": {
      tenantId: 9,
      companyCode: "smilingmolar",
      companyName: "Smiling Molar",
      logo: "assets/images/smilingmolar/logo-dark.png",
      title: "Smiling Molar Admin",
    },
    "admin.ewingdentalnj.com": {
      tenantId: 10,
      companyCode: "ewingdental",
      companyName: "Ewing Dental Group",
      logo: "assets/images/ewingdentalgroup/Ewing Dental Logo.png",
      title: "Ewing Dental Group Admin",
    },
  },

  // Default configuration (fallback)
  default: {
    tenantId: null,
    companyCode: null,
    companyName: "BGP",
    logo: "assets/images/logo-dark.png",
    title: "BGP Admin",
  },
};
