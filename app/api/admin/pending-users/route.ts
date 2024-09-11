// app/api/admin/pending-users/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany({
    where: { status: 'PENDING' },
  });
  return NextResponse.json(users);
}
