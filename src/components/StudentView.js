import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentView() {
  const [queue, setQueue] = useState([]);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    // Fetch the queue data here
    axios.get('/api/queue')
      .then(response => {
        setQueue(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the queue data!', error);
      });
  }, []);

  const studentIndex = queue.findIndex(student => student.name === studentName);

  return (
    <div>
      <h1>Check Your Queue Position</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      {studentIndex > -1 && (
        <div>
          <p>Your position in the queue: {studentIndex + 1}</p>
          <p>Status: {queue[studentIndex].status || 'waiting'}</p>
        </div>
      )}
    </div>
  );
}

export default StudentView;
