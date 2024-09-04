import React, { useState, useEffect } from 'react';

function Queue() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    // Assume we're fetching the queue data from an API
    setQueue([
      { name: 'Student 1', subject: 'Math' },
      { name: 'Student 2', subject: 'Science' },
      // More students...
    ]);
  }, []);

  return (
    <div>
      <h1>Current Queue</h1>
      <ul>
        {queue.map((student, index) => (
          <li key={index}>
            {student.name} - {student.subject}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Queue;
