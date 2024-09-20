import React from 'react';
import clsx from 'clsx';

interface RequestProps {
  currentPosition?: number | null;
  queueCount?: number | null;
  name: string;
  course: string;
  question: string;
  createdAt: string;
  hasShadow?: boolean;
  hasBox?: boolean;
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
      className={clsx(
        'rounded-lg p-6 text-left w-full md:w-4/5 dark:bg-gray-800',
        hasShadow && 'shadow-lg',
        hasBox && 'bg-gray-100'
      )}
    >
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
