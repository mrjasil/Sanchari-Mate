import { NextResponse } from 'next/server';

const API_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/trips`);
    const trips = await response.json();
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}