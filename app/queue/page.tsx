'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { useSession } from 'next-auth/react'; // Use client-side session
import type { Request } from '@prisma/client';

const Queue = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const { data: session } = useSession(); // Client-side session management

  // Fetch the initial requests from the database
  const fetchRequests = async () => {
    const response = await fetch('/api/requests');
    const data = await response.json();
    setRequests(data);
  };

  useEffect(() => {
    // Check if the user is authenticated
    if (!session) {
      // If there's no session, handle redirection client-side
      window.location.href = '/';
      return;
    }

    // Call fetchRequests on component mount to load initial requests
    fetchRequests();

    // Initialize Pusher client
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to the queue channel
    const channel = pusher.subscribe('queue-channel');

    // Listen for the 'update-queue' event and fetch the updated list of requests
    channel.bind('update-queue', () => {
      fetchRequests(); // Fetch the latest requests when a new event is triggered
    });

    // Cleanup when component unmounts
    return () => {
      channel.unbind_all();
      pusher.unsubscribe('queue-channel');
    };
  }, [session]);

  return (
    <div className="p-6 text-left max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4 mt-4">Queue of Current Requests</h1>

      {/* Check if there are any requests */}
      {requests.length > 0 ? (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <p><strong>Name:</strong> {request.name}</p>
              <p><strong>Course:</strong> {request.course}</p>
              <p><strong>Question:</strong> {request.question}</p>
              <p><strong>Submitted at:</strong> {new Date(request.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No requests are currently in the queue.</p>
      )}
    </div>
  );
};

export default Queue;
