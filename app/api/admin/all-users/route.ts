import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import jwt from 'jsonwebtoken';

// Middleware to validate JWT and check if the user is authorized
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify JWT
    const secretKey = process.env.JWT_SECRET; // Store the secret key in your environment variables
    if (!secretKey) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, secretKey);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 403 });
    }

    // Check if the user has the required role (e.g., admin)
    if ((decodedToken as jwt.JwtPayload).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch users from the database
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching all users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
