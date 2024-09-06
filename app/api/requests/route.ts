import { NextResponse } from 'next/server';
import prisma from '@/prisma/client'; // Ensure you set up Prisma properly

// POST: Create a new request
export async function POST(req: Request) {
  const { name, course, question } = await req.json();

  const newRequest = await prisma.request.create({
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

  await prisma.request.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
