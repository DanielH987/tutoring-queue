import { NextResponse } from 'next/server';
import { StatusType } from '@/app/types';
import prisma from '@/prisma/client';

export async function POST(req: Request) {
  try {
    const { userId, action } = await req.json();

    const newStatus = action === 'SUSPEND' ? StatusType.SUSPENDED : StatusType.APPROVED;

    await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error suspending/unsuspending user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}