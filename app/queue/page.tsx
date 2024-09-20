'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { useSession } from 'next-auth/react'; // Use client-side session
import Request from '@/components/Request'; // Import the new Request component
import Modal from '@/components/Modal'; // Import the Modal component
import Toast from '@/components/Toast';
import type { ActiveRequest } from '@prisma/client';

const Queue = () => {
  const [requests, setRequests] = useState<ActiveRequest[]>([]);
  const { data: session, status } = useSession(); // Get session data and loading status

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRequest, setModalRequest] = useState<ActiveRequest | null>(null); // State for the request data in modal

  // Time tracking state
  const [startTime, setStartTime] = useState<number | null>(null); // Store start time for measuring help time

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

  // Trigger when the tutor clicks "Help" but don't process the request yet
  const startHelpSession = async (requestId: string) => {
    const processedRequest = requests.find((request) => request.id === requestId); // Find the request in the state
    if (processedRequest) {
      setModalRequest(processedRequest); // Set the request data in the modal
      setIsModalOpen(true); // Show the modal
      setStartTime(Date.now()); // Record the start time when modal opens

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
    }
  };

  // When the tutor clicks "Finish Help," we process the request and calculate the help time
  const finishHelp = async () => {
    if (modalRequest && startTime) {
      const endTime = Date.now();
      const helpTimeInSeconds = Math.round((endTime - startTime) / 1000); // Calculate help time in seconds

      const tutorId = session?.user.id; // Get the logged-in tutor's ID

      // Make the API call to process the request with the calculated help time
      const response = await fetch('/api/process-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: modalRequest.id,
          tutorId,
          helpTime: helpTimeInSeconds,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchRequests(); // Update the requests list after processing
        closeModal(); // Close the modal after processing
      } else {
        setToastMessage('Failed to process request');
        setShowToast(true); // Show toast for error message
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalRequest(null); // Clear the request from the modal
    setStartTime(null); // Clear the start time when the modal is closed
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
              <li key={request.id} className="bg-gray-100 p-4 rounded-lg shadow-md relative dark:bg-gray-800">
                <div className="absolute top-4 right-4">
                  {/* Add the button in the top-right corner */}
                  <button
                    className="custom-bg-color text-white py-2 px-4 rounded-lg hover:bg-red-900 transition-colors duration-300"
                    onClick={() => startHelpSession(request.id)} // Open the modal and start help session
                  >
                    Help
                  </button>
                </div>
                <Request
                  name={request.name}
                  course={request.course}
                  question={request.question}
                  createdAt={new Date(request.createdAt).toISOString()}
                  hasShadow={false}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No requests are currently in the queue.</p>
        )}

        {/* Modal to display success or failure messages */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Request Status">
          {/* Display the request details inside the modal if available */}
          {modalRequest && (
            <div className="relative">
              <Request
                name={modalRequest.name}
                course={modalRequest.course}
                question={modalRequest.question}
                createdAt={new Date(modalRequest.createdAt).toISOString()}
                hasShadow={false}
                hasBox={false}
              />
              {/* Finish Help button positioned at the bottom-right of the modal */}
              <button
                onClick={finishHelp} // Call finishHelp on click
                className="custom-bg-color text-white py-3 px-4 rounded-lg hover:bg-red-900 transition-colors duration-300 absolute bottom-0 right-0 mb-4 mr-4"
              >
                Finish Help
              </button>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Queue;
