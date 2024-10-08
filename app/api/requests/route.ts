import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

// GET: Fetch all active requests, sorted by creation time
export async function GET() {
  const activeRequests = await prisma.activeRequest.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });

  return NextResponse.json(activeRequests);
}

// POST: Create a new request
export async function POST(req: Request) {
  const { name, course, question } = await req.json();

  const newRequest = await prisma.activeRequest.create({
    data: {
      name,
      course,
      question,
    },
  });

  return NextResponse.json(newRequest);
}

// DELETE: Cancel the request
export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.activeRequest.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
