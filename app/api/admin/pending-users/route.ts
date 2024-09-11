import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { status: 'PENDING' },
    });

    // Return the users or an empty array if no users are found
    return NextResponse.json(users.length ? users : []);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    // Return an error message in case of failure
    return NextResponse.json({ error: 'Failed to fetch pending users' }, { status: 500 });
  }
}
