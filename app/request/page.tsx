"use client";

import { useState, useEffect } from 'react';
import { ActiveRequestType } from '../types';
import Request from '@/components/Request'; // Import the new Request component
import Modal from '@/components/Modal';
import Pusher from 'pusher-js';

const RequestPage = () => {
  const [queueCount, setQueueCount] = useState<number | null>(null); // Queue count starts as null to detect loading state
  const [queueRequests, setQueueRequests] = useState<ActiveRequestType[]>([]); // To store all active requests
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [question, setQuestion] = useState('');
  const [currentRequest, setCurrentRequest] = useState<ActiveRequestType | null>(null);
  const [isRequestLoading, setIsRequestLoading] = useState(true); // Loading state for request area

  // Modal state for when a request is picked up
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Validation states
  const [nameError, setNameError] = useState(false);
  const [courseError, setCourseError] = useState(false);
  const [questionError, setQuestionError] = useState(false);

  // Course options
  const courses = [
    { value: 'POSC 101', label: 'POSC 101' },
    { value: 'POSC 110', label: 'POSC 110' },
    { value: 'POSC 170', label: 'POSC 170' },
    { value: 'POSC 190', label: 'POSC 190' },
    { value: 'POSC 202', label: 'POSC 202' },
    { value: 'POSC 230', label: 'POSC 230' },
    { value: 'POSC 300', label: 'POSC 300' },
    { value: 'POSC 304', label: 'POSC 304' },
  ];

  const fetchQueueData = async () => {
    try {
      const response = await fetch('/api/requests');
      if (response.ok) {
        const data = await response.json();
        setQueueRequests(data); // Store all active requests
        setQueueCount(data.length); // Set queue count based on the number of active requests
      } else {
        console.error('Failed to fetch queue data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching queue data:', error);
    }
  };

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('queue-channel');

    channel.bind('update-queue', async (data: { count: number }) => {
      setQueueCount(data.count); // Update the queue count when receiving Pusher updates
      await fetchQueueData();
    });

    // Fetch queue data initially
    fetchQueueData().finally(() => setIsRequestLoading(false));

    return () => {
      channel.unbind_all();
      pusher.unsubscribe('queue-channel');
    };
  }, []);

  useEffect(() => {
    const storedRequest = localStorage.getItem('currentRequest');
    if (storedRequest && !isRequestLoading) { 
      const parsedRequest = JSON.parse(storedRequest);
      const requestExists = queueRequests.some((req) => req.id.toString() === parsedRequest.id.toString());
      if (!requestExists) {
        localStorage.removeItem('currentRequest');
        setCurrentRequest(null);
      } else {
        setCurrentRequest(parsedRequest);
      }
    }
  }, [queueRequests, isRequestLoading]);
  
  useEffect(() => {
    if (!currentRequest) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusher.subscribe('queue-channel');

    channel.bind('request-picked', async (data: { requestId: string }) => {
      if (currentRequest?.id === data.requestId) {
        setCurrentRequest(null);
        localStorage.removeItem('currentRequest');
        await fetchQueueData();
        setIsModalOpen(true);
      }
    });

    return () => {
      channel.unbind('request-picked');
      pusher.unsubscribe('queue-channel');
    };
  }, [currentRequest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(false);
    setCourseError(false);
    setQuestionError(false);

    if (name === '') setNameError(true);
    if (course === '') setCourseError(true);
    if (question === '') setQuestionError(true);

    if (name && course && question) {
      const newStudent = { name, course, question };
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      const savedRequest = await response.json();
      localStorage.setItem('currentRequest', JSON.stringify(savedRequest));

      await fetch('/api/pusher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'update-queue',
          data: { count: (queueCount ?? 0) + 1 },
        }),
      });

      setCurrentRequest(savedRequest);
      setName('');
      setCourse('');
      setQuestion('');
    }
  };

  const handleCancel = async () => {
    if (currentRequest) {
      await fetch('/api/requests', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: currentRequest.id }),
      });

      await fetch('/api/pusher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'update-queue',
          data: { count: (queueCount ?? 0) - 1 },
        }),
      });

      setCurrentRequest(null);
      localStorage.removeItem('currentRequest');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); 
  };

  const currentPosition = currentRequest
    ? queueRequests.findIndex(req => req.id === currentRequest.id) + 1
    : null;

  return (
    <div className="p-6 text-left max-w-screen-xl mx-auto mb-20 dark:bg-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-4 mt-4">POSC Tutoring Queue</h1>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {isRequestLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center w-full md:w-2/3">
            <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          </div>
        ) : !currentRequest ? (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full md:w-2/3">
            <h2 className="text-2xl font-semibold mb-4">Request Help</h2>

            <div className="mb-4">
              <label htmlFor="name" className="block font-medium mb-1">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${nameError ? 'border-red-600 bg-red-100 dark:bg-red-800' : 'border-gray-300 bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white`}
              />
              {nameError && <p className="text-red-600 dark:text-red-400 text-sm mt-1">This field is required</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="course" className="block font-medium mb-1">Course:</label>
              <select
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className={`w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${courseError ? 'border-red-600 bg-red-100 dark:bg-red-800' : 'border-gray-300 bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white`}
              >
                <option value="" disabled>Select a course</option>
                {courses.map((courseOption) => (
                  <option key={courseOption.value} value={courseOption.value}>
                    {courseOption.label}
                  </option>
                ))}
              </select>
              {courseError && <p className="text-red-600 dark:text-red-400 text-sm mt-1">This field is required</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="question" className="block font-medium mb-1">Question:</label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={`w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${questionError ? 'border-red-600 bg-red-100 dark:bg-red-800' : 'border-gray-300 bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white`}
                rows={4}
              />
              {questionError && <p className="text-red-600 dark:text-red-400 text-sm mt-1">This field is required</p>}
            </div>

            <button type="submit" className="custom-bg-color text-white py-2 px-4 rounded-lg hover:bg-red-900 transition-colors duration-300">
              Request Help
            </button>
          </form>
        ) : (
          <div className="p-6 text-left w-full md:w-2/3">
            <h2 className="text-2xl font-semibold mb-4">Help Requested</h2>
            <Request
              currentPosition={currentPosition}
              queueCount={queueCount}
              name={currentRequest.name}
              course={currentRequest.course}
              question={currentRequest.question}
              createdAt={currentRequest.createdAt}
            />

            <button
              onClick={handleCancel}
              className="custom-bg-color text-white py-2 px-4 rounded-lg hover:bg-red-900 mt-4 transition-colors duration-300"
            >
              Cancel Request
            </button>
          </div>
        )}

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full md:w-1/3 text-center">
          <h3 className="text-xl font-semibold mb-2">Queue Status</h3>
          {queueCount === null ? (
            <p>Loading...</p>
          ) : (
            <p>Queue Length: {queueCount} {queueCount === 1 ? 'person' : 'people'} waiting.</p>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Request Picked Up">
        <p>Your request has been picked up by a tutor. They will assist you shortly!</p>
      </Modal>
    </div>
  );
};

export default RequestPage;
