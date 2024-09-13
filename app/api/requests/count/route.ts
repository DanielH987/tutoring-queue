import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET() {
  const requestCount = await prisma.activeRequest.count();
  return NextResponse.json({ count: requestCount });
}
