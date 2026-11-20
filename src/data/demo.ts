// ---------------------------------------------------------------------------
// SAMPLE DATA — for representation only. Nothing here comes from a database
// and no action in the prototype changes any of it.
// ---------------------------------------------------------------------------

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending' | 'Suspended';
  joined: string;
}

export const demoUsers: DemoUser[] = [
  { id: 'u1', name: 'Ayesha Shoukat', email: 'admin@manziliq.pk', role: 'Super Admin', status: 'Active', joined: '12 Jan 2026' },
  { id: 'u2', name: 'Tariq Mehmood', email: 'tariq.realtor@manziliq.pk', role: 'Dealer', status: 'Active', joined: '28 Feb 2026' },
  { id: 'u3', name: 'Farooq Ahmed', email: 'farooq.buyer@gmail.com', role: 'Buyer', status: 'Active', joined: '03 Mar 2026' },
  { id: 'u4', name: 'Bismillah Estate', email: 'dealer@bismillahestate.pk', role: 'Dealer', status: 'Pending', joined: '19 Oct 2026' },
  { id: 'u5', name: 'Al-Rehman Garden Office', email: 'society@alrehmangarden.pk', role: 'Society Admin', status: 'Active', joined: '07 Jun 2026' },
  { id: 'u6', name: 'Usman Ghani', email: 'usman.ghani@gmail.com', role: 'Buyer', status: 'Suspended', joined: '22 Aug 2026' },
];

export interface DemoListing {
  id: string;
  title: string;
  society: string;
  price: string;
  dealer: string;
  status: 'Pending' | 'Approved' | 'Flagged';
}

export const demoListings: DemoListing[] = [
  { id: 'p1', title: '5 Marla House, Street 4', society: 'Al-Rehman Garden', price: 'PKR 1.15 Crore', dealer: 'Tariq Mehmood', status: 'Pending' },
  { id: 'p2', title: '10 Marla Residential Plot', society: 'Royal Orchard', price: 'PKR 85 Lakh', dealer: 'Bismillah Estate', status: 'Pending' },
  { id: 'p3', title: '1 Kanal House, Block C', society: 'Model Town', price: 'PKR 4.20 Crore', dealer: 'Tariq Mehmood', status: 'Approved' },
  { id: 'p4', title: '7 Marla House, Street 9', society: 'Executive Enclave', price: 'PKR 1.60 Crore', dealer: 'Bismillah Estate', status: 'Flagged' },
];

export interface DemoVerification {
  id: string;
  name: string;
  type: string;
  submitted: string;
  doc: string;
}

export const demoVerifications: DemoVerification[] = [
  { id: 'v1', name: 'Bismillah Estate', type: 'Dealer — CNIC + Licence', submitted: '19 Oct 2026', doc: 'CNIC, dealership licence' },
  { id: 'v2', name: 'Al-Rehman Garden Office', type: 'Society — NOC', submitted: '21 Oct 2026', doc: 'TMA NOC, SECP certificate' },
];

export interface DemoDispute {
  id: string;
  plot: string;
  society: string;
  filedBy: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  summary: string;
}

export const demoDisputes: DemoDispute[] = [
  { id: 'd1', plot: 'Plot 12-A', society: 'Al-Rehman Garden', filedBy: 'Farooq Ahmed', status: 'Open', summary: 'Title ownership contested — plot frozen pending verification.' },
  { id: 'd2', plot: 'Plot 7-C', society: 'Royal Orchard', filedBy: 'Usman Ghani', status: 'Under Review', summary: 'Boundary measurement differs from the society map by 2 ft.' },
];

export interface DemoAudit {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
}

export const demoAuditLogs: DemoAudit[] = [
  { id: 'a1', time: '10:42 AM', actor: 'Ayesha Shoukat', action: 'Approved listing', target: '1 Kanal House, Block C' },
  { id: 'a2', time: '09:15 AM', actor: 'System', action: 'Flagged duplicate', target: '7 Marla House, Street 9' },
  { id: 'a3', time: 'Yesterday', actor: 'Ayesha Shoukat', action: 'Suspended user', target: 'usman.ghani@gmail.com' },
  { id: 'a4', time: 'Yesterday', actor: 'Tariq Mehmood', action: 'Submitted listing', target: '5 Marla House, Street 4' },
  { id: 'a5', time: '18 Oct 2026', actor: 'System', action: 'Password reset', target: 'farooq.buyer@gmail.com' },
];

export const salesChartData = [
  { month: 'Jan', salesPKR: 12.5, bookings: 14 },
  { month: 'Feb', salesPKR: 18.2, bookings: 22 },
  { month: 'Mar', salesPKR: 15.0, bookings: 19 },
  { month: 'Apr', salesPKR: 24.8, bookings: 31 },
  { month: 'May', salesPKR: 32.0, bookings: 40 },
  { month: 'Jun', salesPKR: 28.5, bookings: 36 },
  { month: 'Jul', salesPKR: 42.0, bookings: 54 },
  { month: 'Aug', salesPKR: 48.5, bookings: 62 },
];

export const societyShare = [
  { name: 'Al-Rehman Garden', value: 45, color: '#f59e0b' },
  { name: 'Royal Orchard', value: 30, color: '#10b981' },
  { name: 'Model Town', value: 18, color: '#3b82f6' },
  { name: 'Executive Enclave', value: 7, color: '#6366f1' },
];
