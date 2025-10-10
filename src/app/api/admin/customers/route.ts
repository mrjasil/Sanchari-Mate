import { NextRequest, NextResponse } from 'next/server';

// JSON Server base URL
const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001';

// Define TypeScript interfaces
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
  blockedAt?: string;
  blockReason?: string;
  totalBookings?: number;
  createdAt?: string;
}

interface BlockUserRequest {
  userId: string;
  reason: string;
  cancelPendingBookings?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const qs = new URLSearchParams();
    // JSON Server supports q= for full-text search
    if (search) qs.append('q', search);

    const res = await fetch(`${JSON_SERVER_URL}/customers?${qs.toString()}`);
    if (!res.ok) throw new Error('JSON Server customers fetch failed');
    let customers: Customer[] = await res.json();

    if (status === 'blocked') {
      customers = customers.filter(c => c.isBlocked);
    } else if (status === 'active') {
      customers = customers.filter(c => !c.isBlocked);
    }

    return NextResponse.json({ success: true, customers, total: customers.length });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BlockUserRequest = await request.json();
    const { userId, reason } = body;

    if (!userId || !reason) {
      return NextResponse.json({ success: false, error: 'User ID and reason are required' }, { status: 400 });
    }

    // Patch the customer in JSON Server
    const payload = {
      isBlocked: true,
      blockReason: reason,
      blockedAt: new Date().toISOString(),
    };

    const res = await fetch(`${JSON_SERVER_URL}/customers/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`JSON Server block failed: ${msg}`);
    }

    const updated = await res.json();
    return NextResponse.json({ success: true, message: 'User blocked successfully', user: updated });
  } catch (error) {
    console.error('Error blocking user:', error);
    return NextResponse.json({ success: false, error: 'Failed to block user' }, { status: 500 });
  }
}

// Add PATCH method for unblocking users
export async function PATCH(request: NextRequest) {
  try {
    const body: { userId: string } = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const payload = {
      isBlocked: false,
      blockReason: null,
      blockedAt: null,
    } as any;

    const res = await fetch(`${JSON_SERVER_URL}/customers/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`JSON Server unblock failed: ${msg}`);
    }

    const updated = await res.json();
    return NextResponse.json({ success: true, message: 'User unblocked successfully', user: updated });
  } catch (error) {
    console.error('Error unblocking user:', error);
    return NextResponse.json({ success: false, error: 'Failed to unblock user' }, { status: 500 });
  }
}