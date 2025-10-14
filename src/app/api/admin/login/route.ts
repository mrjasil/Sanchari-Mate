import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('Login attempt:', { email });

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check credentials
    const isValid = email === 'admin@sanchari.com' && password === 'admin123';

    if (isValid) {
      const adminUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@sanchari.com',
        role: 'admin',
        lastLogin: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        user: adminUser,
        message: 'Login successful'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Authentication service temporarily unavailable'
      },
      { status: 503 }
    );
  }
}