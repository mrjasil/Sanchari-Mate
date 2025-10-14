import { createResource, apiCall } from '@/lib/api';
import { DashboardStats } from '@/types/admin'; // Now this will work

const usersResource = createResource('users');
const tripsResource = createResource('trips');
const bookingsResource = createResource('bookings');
const paymentsResource = createResource('payments');
const enquiriesResource = createResource('enquiries');

export const adminService = {
  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const [payments, bookings, users, enquiries, trips] = await Promise.all([
      paymentsResource.getAll(),
      bookingsResource.getAll(),
      usersResource.getAll(),
      enquiriesResource.getAll(),
      tripsResource.getAll(),
    ]);

    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    // Revenue calculation
    const currentMonthRevenue = payments
      .filter((p: any) => 
        new Date(p.paymentDate).getMonth() === currentMonth && 
        p.status === 'completed'
      )
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    const lastMonthRevenue = payments
      .filter((p: any) => 
        new Date(p.paymentDate).getMonth() === lastMonth && 
        p.status === 'completed'
      )
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    const revenueChange = lastMonthRevenue > 0 
      ? Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;

    // Bookings calculation
    const currentMonthBookings = bookings.filter((b: any) => 
      new Date(b.createdAt).getMonth() === currentMonth
    ).length;

    const lastMonthBookings = bookings.filter((b: any) => 
      new Date(b.createdAt).getMonth() === lastMonth
    ).length;

    const bookingsChange = lastMonthBookings > 0
      ? Math.round(((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100)
      : 0;

    return {
      revenue: {
        current: currentMonthRevenue,
        previous: lastMonthRevenue,
        change: revenueChange,
      },
      newBookings: {
        current: currentMonthBookings,
        previous: lastMonthBookings,
        change: bookingsChange,
      },
      totalCustomers: users.length,
      pendingEnquiries: enquiries.filter((e: any) => e.status === 'pending').length,
      totalTrips: trips.length,
    };
  },

  // User Management
  users: {
    ...usersResource,
    blockUser: (userId: string) => 
      usersResource.patch(userId, { isBlocked: true }),
    
    unblockUser: (userId: string) => 
      usersResource.patch(userId, { isBlocked: false }),
  },

  // Trip Management
  trips: {
    ...tripsResource,
  },

  // Bookings Management
  bookings: {
    ...bookingsResource,
  },

  // Payments Management
  payments: {
    ...paymentsResource,
  },

  // Enquiries Management
  enquiries: {
    ...enquiriesResource,
    markAsReplied: (enquiryId: string) =>
      enquiriesResource.patch(enquiryId, { status: 'replied' }),
  },
};