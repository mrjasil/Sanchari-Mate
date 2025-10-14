import { NextResponse } from 'next/server';

const API_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001';

export async function GET() {
  try {
    // Fetch data from JSON server
    const [payments, bookings, users, enquiries, trips] = await Promise.all([
      fetch(`${API_URL}/payments`).then(res => res.json()),
      fetch(`${API_URL}/bookings`).then(res => res.json()),
      fetch(`${API_URL}/users`).then(res => res.json()),
      fetch(`${API_URL}/enquiries`).then(res => res.json()),
      fetch(`${API_URL}/trips`).then(res => res.json()),
    ]);

    // Calculate revenue from completed payments
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
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

    // Calculate new bookings (joined trips last month)
    const currentMonthBookings = bookings.filter((b: any) => 
      new Date(b.createdAt).getMonth() === currentMonth
    ).length;

    const lastMonthBookings = bookings.filter((b: any) => 
      new Date(b.createdAt).getMonth() === lastMonth
    ).length;

    const bookingsChange = lastMonthBookings > 0
      ? Math.round(((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100)
      : 0;

    const stats = {
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

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}