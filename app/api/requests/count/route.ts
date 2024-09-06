import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET() {
  const requestCount = await prisma.request.count();
  return NextResponse.json({ count: requestCount });
}
