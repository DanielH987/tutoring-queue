'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { useSession } from 'next-auth/react'; // Use client-side session
import Modal from '@/components/Modal'; // Import the Modal component
import Toast from '@/components/Toast';
import type { ActiveRequest } from '@prisma/client';

const Queue = () => {
  const [requests, setRequests] = useState<ActiveRequest[]>([]);
  const { data: session, status } = useSession(); // Get session data and loading status

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // Toast state
  const [showToast, setShowToast] = useState(false); // State to manage toast visibility
  const [toastMessage, setToastMessage] = useState('');

  // Fetch the initial requests from the database
  const fetchRequests = async () => {
    const response = await fetch('/api/requests');
    const data = await response.json();
    setRequests(data);
  };

  useEffect(() => {
    // Only proceed if session is authenticated
    if (status === 'authenticated') {
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
    } else if (status === 'unauthenticated') {
      // Redirect if not authenticated
      window.location.href = '/';
    }
  }, [status]);

  const processRequest = async (requestId: string, helpTime: number) => {
    const tutorId = session?.user.id; // Get the logged-in tutor's ID
  
    const response = await fetch('/api/process-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId,
        tutorId,
        helpTime, // You can capture help time as part of your logic
      }),
    });
  
    const data = await response.json();
  
    if (data.success) {
      setModalMessage('Request processed successfully!'); // Set modal message
      setIsModalOpen(true); // Show the modal

      // Trigger a Pusher event to notify the student that their request has been picked up
      await fetch('/api/pusher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'request-picked',
          data: { requestId }, // Include the request ID in the event data
        }),
      });
  
      fetchRequests(); // Update the requests
    } else {
      setToastMessage('Failed to process request');
      setShowToast(true); // Show modal for error message
    }
  };
  
  // Display a loading state until session data is available
  if (status === 'loading') {
    return (
      <div className="p-6 text-left max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold mb-4 mt-4">Queue of Current Requests</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {showToast && (
        <div className="z-50">
          <Toast
            message={toastMessage}
            type='destructive'
            onClose={() => setShowToast(false)} // Close the toast
          />
        </div>
      )}
      <div className="p-6 text-left max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold mb-4 mt-4">Queue of Current Requests</h1>

        {/* Check if there are any requests */}
        {requests.length > 0 ? (
          <ul className="space-y-4">
            {requests.map((request) => (
              <li key={request.id} className="bg-gray-100 p-4 rounded-lg shadow-md relative">
                <div className="absolute top-4 right-4">
                  {/* Add the button in the top-right corner */}
                  <button
                    className="custom-bg-color text-white py-2 px-4 rounded-lg hover:bg-red-900 transition-colors duration-300"
                    onClick={() => processRequest(request.id, 30)} // Example help time of 30 minutes
                  >
                    Help
                  </button>
                </div>
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

        {/* Modal to display success or failure messages */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request Status">
          <p>{modalMessage}</p>
        </Modal>
      </div>
    </>
  );
};

export default Queue;
