// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';

// Mock user data - replace with your actual database call
const users = [
  {
    id: "1759686159009",
    email: "jasiljinu627@gmail.com",
    password: "jasil@123456789",
    isAdmin: false
  },
  {
    id: "1759692243661", 
    email: "jezlajebin@gmail.com",
    password: "jezla@123456789",
    isAdmin: false
  },
  {
    id: "admin_001",
    email: "admin@sanchari.com",
    password: "admin123",
    isAdmin: true
  }
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    console.log('Login attempt received:', { email });

    // Find user in database
    const user = users.find(u => u.email === email && u.password === password);
    
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