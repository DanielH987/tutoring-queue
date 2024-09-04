import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TutorDashboard() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    // Fetch the initial queue data here
    axios.get('/api/queue')
      .then(response => {
        setQueue(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the queue data!', error);
      });
  }, []);

  const handleHelpStudent = (index) => {
    const updatedQueue = [...queue];
    updatedQueue[index].status = 'being helped';

    // Optionally update the backend with the new status
    setQueue(updatedQueue);
  };

  return (
    <div>
      <h1>Tutor Dashboard</h1>
      <ul>
        {queue.map((student, index) => (
          <li key={index}>
            {student.name} - {student.subject} - {student.status || 'waiting'}
            <button onClick={() => handleHelpStudent(index)}>Help Student</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TutorDashboard;
