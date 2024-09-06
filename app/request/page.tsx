"use client";

import { useState } from 'react';

const RequestPage = () => {
  const [queue, setQueue] = useState<{ name: string; course: string; question: string }[]>([]);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [question, setQuestion] = useState('');

  // Validation states
  const [nameError, setNameError] = useState(false);
  const [courseError, setCourseError] = useState(false);
  const [questionError, setQuestionError] = useState(false);

  // Course options
  const courses = [
    { value: 'POSC 202', label: 'POSC 202' },
    { value: 'POSC 301', label: 'POSC 301' },
    { value: 'POSC 371', label: 'POSC 371' },
    { value: 'POSC 401', label: 'POSC 401' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
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
      setQueue([...queue, newStudent]);
      setName('');
      setCourse('');
      setQuestion('');
    }
  };

  return (
    <div className="p-6 text-left max-w-screen-lg mx-auto">
      <h1 className="text-4xl font-bold mb-4 mt-4">POSC Tutoring Queue</h1>

      <div className="flex justify-between items-start gap-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-2/3">
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

          <button type="submit" className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300">
            Request Help
          </button>
        </form>

        <div className="bg-gray-100 rounded-lg shadow-lg p-4 w-1/4 text-center">
          <h3 className="text-xl font-semibold mb-2">Queue Status</h3>
          <p>Queue Length: {queue.length} {queue.length === 1 ? 'person' : 'people'} waiting.</p>
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
