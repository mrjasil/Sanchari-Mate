import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/chatRequests/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        approvedAt: body.status === 'approved' ? new Date().toISOString() : undefined
      }),
    });

    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update chat request' }, { status: 500 });
  }
}