import { NextRequest, NextResponse } from 'next/server';

// Mock admin user - replace with actual database query
const adminUsers = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'admin@sanchariate.com',
    password: 'admin123', // In production, use hashed passwords
    role: 'super_admin' as const,
    createdAt: new Date(),
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find admin user
    const adminUser = adminUsers.find(user => user.email === email);
    
    if (!adminUser || adminUser.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In production, use proper JWT token
    const token = Buffer.from(JSON.stringify({
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    })).toString('base64');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = adminUser;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}