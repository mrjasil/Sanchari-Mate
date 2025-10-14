import { NextResponse } from 'next/server';

const API_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();
    
    if (action === 'block') {
      const response = await fetch(`${API_URL}/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: true }),
      });
      return NextResponse.json(await response.json());
    } else if (action === 'unblock') {
      const response = await fetch(`${API_URL}/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: false }),
      });
      return NextResponse.json(await response.json());
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await fetch(`${API_URL}/users/${params.id}`, { method: 'DELETE' });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}