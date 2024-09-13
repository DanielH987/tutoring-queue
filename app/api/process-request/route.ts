import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function POST(req: Request) {
  try {
    const { requestId, tutorId, helpTime } = await req.json();

    // Find the active request by ID
    const activeRequest = await prisma.activeRequest.findUnique({
      where: { id: requestId },
    });

    if (!activeRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Calculate the wait time (in seconds) by subtracting createdAt from the current time
    const now = new Date();
    const waitTimeInSeconds = Math.round((now.getTime() - activeRequest.createdAt.getTime()) / 1000);  // Dividing by 1000 for seconds

    // Assume helpTime is provided in seconds, or you can modify your logic to calculate it accordingly

    // Create a new ProcessedRequest
    const processedRequest = await prisma.processedRequest.create({
      data: {
        studentName: activeRequest.name,
        course: activeRequest.course,
        question: activeRequest.question,
        tutorId,
        waitTime: waitTimeInSeconds,  // Save wait time in seconds
        helpTime,  // Assuming helpTime is also provided in seconds
      },
    });

    // Now that the request has been processed, delete the active request
    await prisma.activeRequest.delete({
      where: { id: requestId },
    });

    return NextResponse.json({ success: true, processedRequest });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
