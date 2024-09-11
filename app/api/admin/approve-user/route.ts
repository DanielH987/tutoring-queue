// app/api/admin/approve-user/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, action } = await req.json();
  
  const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

  await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  return NextResponse.json({ success: true });
}
