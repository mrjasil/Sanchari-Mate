import { NextRequest, NextResponse } from 'next/server';

// Define TypeScript interfaces
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
  blockedAt?: string;
  blockReason?: string;
  totalBookings: number;
  createdAt: string;
}

interface BlockUserRequest {
  userId: string;
  reason: string;
  cancelPendingBookings?: boolean;
}

// Mock data - replace with actual database calls
const mockCustomers: Customer[] = [
  {
    id: 'CUST001',
    name: 'Rahul Sharma',
    email: 'rahul@email.com',
    phone: '+919876543210',
    isBlocked: false,
    totalBookings: 5,
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'CUST002',
    name: 'Priya Patel',
    email: 'priya@email.com',
    phone: '+919876543211',
    isBlocked: true,
    blockReason: 'Payment Issues',
    blockedAt: '2024-01-18T00:00:00.000Z',
    totalBookings: 2,
    createdAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 'CUST003',
    name: 'Amit Kumar',
    email: 'amit@email.com',
    phone: '+919876543212',
    isBlocked: false,
    totalBookings: 8,
    createdAt: '2024-01-05T00:00:00.000Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    let customers: Customer[] = [...mockCustomers];

    // Apply filters
    if (status === 'blocked') {
      customers = customers.filter(customer => customer.isBlocked);
    } else if (status === 'active') {
      customers = customers.filter(customer => !customer.isBlocked);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone.includes(search)
      );
    }

    return NextResponse.json({ 
      success: true,
      customers,
      total: customers.length
    });
    
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch customers' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BlockUserRequest = await request.json();
    const { userId, reason, cancelPendingBookings = true } = body;

    // Validate request body
    if (!userId || !reason) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User ID and reason are required' 
        },
        { status: 400 }
      );
    }

    // Find user in mock data - replace with actual database update
    const userIndex = mockCustomers.findIndex(customer => customer.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found' 
        },
        { status: 404 }
      );
    }

    // Update user block status
    mockCustomers[userIndex] = {
      ...mockCustomers[userIndex],
      isBlocked: true,
      blockReason: reason,
      blockedAt: new Date().toISOString(),
    };

    // If cancelPendingBookings is true, cancel user's pending bookings
    if (cancelPendingBookings) {
      // Add your logic to cancel pending bookings here
      console.log(`Canceling pending bookings for user: ${userId}`);
    }

    return NextResponse.json({ 
      success: true,
      message: 'User blocked successfully',
      user: mockCustomers[userIndex]
    });

  } catch (error) {
    console.error('Error blocking user:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to block user' 
      },
      { status: 500 }
    );
  }
}

// Add PATCH method for unblocking users
export async function PATCH(request: NextRequest) {
  try {
    const body: { userId: string } = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User ID is required' 
        },
        { status: 400 }
      );
    }

    // Find user in mock data - replace with actual database update
    const userIndex = mockCustomers.findIndex(customer => customer.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found' 
        },
        { status: 404 }
      );
    }

    // Update user unblock status
    mockCustomers[userIndex] = {
      ...mockCustomers[userIndex],
      isBlocked: false,
      blockReason: undefined,
      blockedAt: undefined,
    };

    return NextResponse.json({ 
      success: true,
      message: 'User unblocked successfully',
      user: mockCustomers[userIndex]
    });

  } catch (error) {
    console.error('Error unblocking user:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to unblock user' 
      },
      { status: 500 }
    );
  }
}