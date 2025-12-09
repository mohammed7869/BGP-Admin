import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  // {
  //   id: 1,
  //   label: 'Insights',
  //   icon: 'ri-bar-chart-grouped-line',
  //   subItems: [
  //    // { id: 2, label: 'Summary', icon: 'ri-dashboard-line', link: '/dashboard/summary', parentId: 1 },
  //     { id: 3, label: 'Profiles', icon: 'ri-user-3-line', link: '/profiles', parentId: 1 },
  //    // { id: 4, label: 'SEO', icon: 'ri-search-eye-line', link: '/seo', parentId: 1 }
  //   ]
  // },
  {
    id: 1,
    label: 'Users',
    icon: 'ri-user-3-line',
    link: '/'
  },
  {
    id: 5,
    label: 'Patients',
    icon: 'ri-user-heart-line',
    link: '/patients'
  },
  // {
  //   id: 6,
  //   label: 'Inbox',
  //   icon: 'ri-inbox-line',
  //   link: '/inbox'
  // },
  {
    id: 7,
    label: 'Appointments',
    icon: 'ri-calendar-check-line',
    subItems: [
      { id: 22, label: 'List', icon: 'ri-shield-line', link: '/appointments', parentId: 7 },
      { id: 23, label: 'Archived', icon: 'ri-time-line', link: '/appointments/archived', parentId: 7 },
    ]
  },
  {
    id: 8,
    label: 'Care Connect Profiles',
    icon: 'ri-profile-line',
    link: '/doctors-profiles'
  },
  {
    id: 9,
    label: 'Website Editor',
    icon: 'ri-edit-2-line',
    link: '/website-editor'
  },
  {
    id: 10,
    label: 'Enquiries',
    icon: 'ri-message-3-line',
    link: '/enquiry'
  },
  // {
  //   id: 11,
  //   label: 'Phone Leads',
  //   icon: 'ri-phone-line',
  //   link: '/phone-leads'
  // },
  // {
  //   id: 12,
  //   label: 'Reminders',
  //   icon: 'ri-notification-2-line',
  //   link: '/reminders'
  // },
  {
    id: 13,
    label: 'Calendar',
    icon: 'ri-calendar-line',
    link: '/calendar'
  },
  // {
  //   id: 14,
  //   label: 'Payments',
  //   icon: 'ri-bank-card-line',
  //   link: '/payments'
  // },
  // {
  //   id: 15,
  //   label: 'Reputation',
  //   icon: 'ri-star-line',
  //   link: '/reputation'
  // },
  {
    id: 30,
    label: 'CMS',
    icon: 'ri-layout-line',
    subItems: [
      { id: 16, label: 'Blog Posts', icon: 'ri-article-line', link: '/blog', parentId: 30 },
      { id: 17, label: 'Meta Tags', icon: 'ri-creative-commons-by-line', link: '/cms-meta', parentId: 30 },
      { id: 27, label: 'Tags', icon: 'ri-price-tag-3-line', link: '/cms-tag', parentId: 30 },
      { id: 28, label: 'Media Library', icon: 'ri-image-line', link: '/cms-media', parentId: 30 },
      { id: 29, label: 'Pages', icon: 'ri-file-text-line', link: '/cms-page', parentId: 30 }
    ]
  },
  {
    id: 18,
    label: 'MENUITEMS.SETTINGS.TEXT',
    icon: 'ri-settings-3-line',
    subItems: [
      { id: 24, label: 'General Insurance', icon: 'ri-shield-line', link: '/masters/general-insurance', parentId: 18 },
      { id: 25, label: 'Daily Slot', icon: 'ri-time-line', link: '/masters/appointment-daily-slot', parentId: 18 },
      { id: 26, label: 'Location', icon: 'ri-map-pin-line', link: '/masters/appointment-location', parentId: 18 },
      { id: 31, label: 'MENUITEMS.SETTINGS.LIST.EMAIL_SETTINGS', icon: 'ri-mail-settings-line', link: '/admin/email-setting', parentId: 18 },
      { id: 32, label: 'MENUITEMS.SETTINGS.LIST.EMAIL_TEMPLATES', icon: 'ri-mail-line', link: '/admin/email-template', parentId: 18 }
    ]
  }
];
