// app/api/admin/approve-user/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function POST(req: Request) {
  try {
    const { userId, action } = await req.json();

    if (action === 'APPROVE') {
      await prisma.user.update({
        where: { id: userId },
        data: { status: 'APPROVED' },
      });
    } else if (action === 'REJECT') {
      await prisma.user.delete({
        where: { id: userId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error approving/rejecting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
