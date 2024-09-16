import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}