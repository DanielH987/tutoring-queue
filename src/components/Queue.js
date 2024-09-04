import React, { useState, useEffect } from 'react';
import '../styles/Queue.css';

function Queue() {
  const [queue, setQueue] = useState([]);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudent = { name, course, question };
    setQueue([...queue, newStudent]);
    setName('');
    setCourse('');
    setQuestion('');
  };

  return (
    <div className="queue-container">
      <h1 className="queue-heading">POSC Tutoring Queue</h1>
      
      <div className="queue-content">
        <form onSubmit={handleSubmit} className="queue-form">
          <h2>Request Help</h2>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="course">Course:</label>
            <input 
              type="text" 
              id="course" 
              value={course} 
              onChange={(e) => setCourse(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="question">Question:</label>
            <textarea 
              id="question" 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">Request Help</button>
        </form>

        <div className="queue-status">
          <h3>Queue Status</h3>
          <p>Queue Length: {queue.length} {queue.length === 1 ? 'person' : 'people'} waiting.</p>
        </div>
      </div>
    </div>
  );
}

export default Queue;
