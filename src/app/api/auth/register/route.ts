import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDB(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, profilePic } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const db = readDB();
    
    // Check if user exists
    if (db.users.find((user: any) => user.email === email)) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      profilePic: profilePic || '/images/default-avatar.jpg',
      createdAt: new Date().toISOString()
    };

    // Save to database
    db.users.push(newUser);
    writeDB(db);

    // Return user without password
    const { password: _, ...userResponse } = newUser;

    return NextResponse.json(
      { user: userResponse, message: 'Registration successful' },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}