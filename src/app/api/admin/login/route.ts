// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';

const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    console.log('Login attempt received:', { email });

    // Validate against JSON Server admins collection
    const res = await fetch(`${JSON_SERVER_URL}/admins?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Auth service unavailable' }, { status: 503 });
    }
    const matches = await res.json();
    const user = Array.isArray(matches) ? matches[0] : null;
    
    if (user) {
      // Check if user is admin
      if (user.isAdmin) {
        console.log('Admin login successful');
        return NextResponse.json({ 
          success: true,
          message: 'Admin login successful',
          user: {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin
          }
        });
      } else {
        console.log('User is not admin');
        return NextResponse.json(
          { 
            success: false, 
            error: 'Access denied. Admin privileges required.' 
          },
          { status: 403 }
        );
      }
    } else {
      console.log('Invalid credentials');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}