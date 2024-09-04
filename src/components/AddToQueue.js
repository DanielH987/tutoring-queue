import React, { useState } from 'react';
import axios from 'axios';

function AddToQueue() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudent = { name, subject };

    // Add to the queue (you can update state or send data to an API)
    axios.post('/api/queue', newStudent)
      .then(response => {
        console.log(response.data);
        // Optionally, redirect or show a success message
      })
      .catch(error => {
        console.error('There was an error adding the student to the queue!', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <button type="submit">Add to Queue</button>
    </form>
  );
}

export default AddToQueue;
