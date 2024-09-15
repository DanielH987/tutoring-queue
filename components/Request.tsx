import React from 'react';

interface RequestProps {
  currentPosition?: number | null; // Optional
  queueCount?: number | null; // Optional
  name: string;
  course: string;
  question: string;
  createdAt: string;
  hasShadow?: boolean; // Optional prop to toggle shadow
  hasBox?: boolean; // Optional prop to toggle box border
}

const Request: React.FC<RequestProps> = ({
  currentPosition,
  queueCount,
  name,
  course,
  question,
  createdAt,
  hasShadow = true,
  hasBox = true,
}) => {
  return (
    <div
      className={
        `
          rounded-lg p-6 text-left w-full md:w-4/5 
          ${hasShadow ? 'shadow-lg' : ''} 
          ${hasBox ? 'bg-gray-100' : ''}
        `
      }
    >
      {/* Only display position and queue count if both are provided */}
      {currentPosition !== undefined && queueCount !== undefined && (
        <p>
          <strong>Current Position:</strong> {currentPosition} of {queueCount}
        </p>
      )}
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Course:</strong> {course}
      </p>
      <p>
        <strong>Question:</strong> {question}
      </p>
      <p className="whitespace-nowrap overflow-hidden">
        <strong>Submitted at:</strong>{' '}
        {new Date(createdAt).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })}
      </p>
    </div>
  );
};

export default Request;
