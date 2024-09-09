"use client";

import { useState, useEffect } from 'react';
import { Request } from '../types';
import Pusher from 'pusher-js';

const RequestPage = () => {
  const [queueCount, setQueueCount] = useState<number | null>(null); // Queue count starts as null to detect loading state
  const [queueRequests, setQueueRequests] = useState<Request[]>([]); // To store all active requests
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [question, setQuestion] = useState('');
  const [currentRequest, setCurrentRequest] = useState<{ 
    name: string; 
    course: string; 
    question: string;
    id: string;
    createdAt: string;
  } | null>(null);
  const [isRequestLoading, setIsRequestLoading] = useState(true); // Loading state for request area

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

  // Load current request, queue count, and active requests from backend
  useEffect(() => {
    // Initialize Pusher client
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to the queue channel
    const channel = pusher.subscribe('queue-channel');

    // Listen for queue updates
    channel.bind('update-queue', (data: { count: number }) => {
      setQueueCount(data.count); // Update the queue count when receiving Pusher updates
    });

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

    // Load current request from localStorage
    const storedRequest = localStorage.getItem('currentRequest');
    if (storedRequest) {
      setCurrentRequest(JSON.parse(storedRequest));
    }

    // Fetch queue data and stop loading state
    fetchQueueData().finally(() => setIsRequestLoading(false));

    // Cleanup on component unmount
    return () => {
      channel.unbind_all();
      pusher.unsubscribe('queue-channel');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Reset error states
    setNameError(false);
    setCourseError(false);
    setQuestionError(false);
  
    // Validation checks
    if (name === '') setNameError(true);
    if (course === '') setCourseError(true);
    if (question === '') setQuestionError(true);
  
    if (name && course && question) {
      const newStudent = { name, course, question };
  
      // Store request in backend
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });
  
      const savedRequest = await response.json();
  
      // Store the current request in localStorage
      localStorage.setItem('currentRequest', JSON.stringify(savedRequest));
  
      // Trigger the Pusher event to update the queue
      await fetch('/api/pusher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'update-queue',
          data: { count: (queueCount ?? 0) + 1 }, // Increment queue count
        }),
      });
  
      // Set the current request state
      setCurrentRequest(savedRequest);
  
      // Clear form fields
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
  
      // Trigger the Pusher event to update the queue
      await fetch('/api/pusher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'update-queue',
          data: { count: (queueCount ?? 0) - 1 }, // Decrement queue count
        }),
      });
  
      // Clear the current request and remove it from localStorage
      setCurrentRequest(null);
      localStorage.removeItem('currentRequest');
    }
  };

  // Calculate the current position of the user's request in the queue
  const currentPosition = currentRequest
    ? queueRequests.findIndex(req => req.id === currentRequest.id) + 1 // Find the index and add 1 (since index starts at 0)
    : null;

  return (
    <div className="p-6 text-left max-w-screen-xl mx-auto mb-20">
      <h1 className="text-4xl font-bold mb-4 mt-4">POSC Tutoring Queue</h1>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Queue Form or Current Request */}
        {isRequestLoading ? (
          <div className="bg-white rounded-lg p-6 text-center w-full md:w-2/3">
            <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          </div>
        ) : !currentRequest ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full md:w-2/3">
            <h2 className="text-2xl font-semibold mb-4">Request Help</h2>

            <div className="mb-4">
              <label htmlFor="name" className="block font-medium mb-1">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2 border rounded-lg ${nameError ? 'border-red-600 bg-red-100' : 'border-gray-300 bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-black`}
              />
              {nameError && <p className="text-red-600 text-sm mt-1">This field is required</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="course" className="block font-medium mb-1">Course:</label>
              <select
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className={`w-full p-2 border rounded-lg ${courseError ? 'border-red-600 bg-red-100' : 'border-gray-300 bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-black`}
              >
                <option value="" disabled>Select a course</option>
                {courses.map((courseOption) => (
                  <option key={courseOption.value} value={courseOption.value}>
                    {courseOption.label}
                  </option>
                ))}
              </select>
              {courseError && <p className="text-red-600 text-sm mt-1">This field is required</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="question" className="block font-medium mb-1">Question:</label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={`w-full p-2 border rounded-lg ${questionError ? 'border-red-600 bg-red-100' : 'border-gray-300 bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-black`}
                rows={4}
              />
              {questionError && <p className="text-red-600 text-sm mt-1">This field is required</p>}
            </div>

            <button type="submit" className="custom-bg-color text-white py-2 px-4 rounded-lg hover:bg-red-900 transition-colors duration-300">
              Request Help
            </button>
          </form>
        ) : (
          <div className=" p-6 text-left w-full md:w-2/3">
            <h2 className="text-2xl font-semibold mb-4">Help Requested</h2>
            <div className="bg-gray-100 rounded-lg shadow-lg p-6 text-left w-full md:w-4/5">
              <p><strong>Current Position:</strong> {currentPosition} of {queueCount}</p>
              <p><strong>Name:</strong> {currentRequest.name}</p>
              <p><strong>Course:</strong> {currentRequest.course}</p>
              <p><strong>Question:</strong> {currentRequest.question}</p>
              <p className="whitespace-nowrap overflow-hidden">
                <strong>Submitted at:</strong> {new Date(currentRequest.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </p>
            </div>

            <button
              onClick={handleCancel}
              className="custom-bg-color text-white py-2 px-4 rounded-lg hover:bg-red-900 mt-4 transition-colors duration-300"
            >
              Cancel Request
            </button>
          </div>
        )}

        {/* Queue Status Box */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-4 w-full md:w-1/3 text-center">
          <h3 className="text-xl font-semibold mb-2">Queue Status</h3>
          {queueCount === null ? (
            <p>Loading...</p>
          ) : (
            <p>Queue Length: {queueCount} {queueCount === 1 ? 'person' : 'people'} waiting.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
