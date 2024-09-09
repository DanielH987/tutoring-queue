import { NextResponse } from 'next/server';
import Pusher from 'pusher';

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Define the POST method handler
export async function POST(req: Request) {
  try {
    const { event, data } = await req.json(); // Read request body as JSON

    // Trigger the Pusher event
    await pusher.trigger('queue-channel', event, data);

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error('Error triggering Pusher:', errorMessage);

    // Return error response
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
