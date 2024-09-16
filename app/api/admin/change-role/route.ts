import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function POST(req: Request) {
  try {
    const { userId, role } = await req.json();

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error changing user role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}