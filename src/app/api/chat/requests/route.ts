import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/chatRequests`);
    const requests = await response.json();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chat requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRequest = {
      ...body,
      id: Date.now().toString(),
      requestedAt: new Date().toISOString(),
      status: 'pending'
    };

    const response = await fetch(`${API_URL}/chatRequests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest),
    });

    return NextResponse.json(newRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create chat request' }, { status: 500 });
  }
}