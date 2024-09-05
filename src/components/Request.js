import React, { useState } from 'react';
import '../styles/Request.css';

function Request() {
  const [queue, setQueue] = useState([]);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [question, setQuestion] = useState('');
  
  // Validation states
  const [nameError, setNameError] = useState(false);
  const [courseError, setCourseError] = useState(false);
  const [questionError, setQuestionError] = useState(false);

  // Course options
  const [courses] = useState([
    { value: 'POSC 202', label: 'POSC 202' },
    { value: 'POSC 301', label: 'POSC 301' },
    { value: 'POSC 371', label: 'POSC 371' },
    { value: 'POSC 401', label: 'POSC 401' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset error states
    setNameError(false);
    setCourseError(false);
    setQuestionError(false);

    // Validation checks
    if (name === '') {
      setNameError(true);
    }
    if (course === '') {
      setCourseError(true);
    }
    if (question === '') {
      setQuestionError(true);
    }

    if (name && course && question) {
      const newStudent = { name, course, question };
      setQueue([...queue, newStudent]);
      setName('');
      setCourse('');
      setQuestion('');
    }
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
              className={nameError ? 'input-error' : ''}
              // required 
            />
            {nameError && <p className="error-message">This field is required</p>}
          </div>
          <div className="form-group">
            <label htmlFor="course">Course:</label>
            <select 
              id="course" 
              value={course} 
              onChange={(e) => setCourse(e.target.value)} 
              className={courseError ? 'input-error' : ''}
              // required
            >
              <option value="" disabled></option>
              {courses.map((courseOption) => (
                <option key={courseOption.value} value={courseOption.value}>
                  {courseOption.label}
                </option>
              ))}
            </select>
            {courseError && <p className="error-message">This field is required</p>}
          </div>
          <div className="form-group">
            <label htmlFor="question">Question:</label>
            <textarea 
              id="question" 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)} 
              className={questionError ? 'input-error' : ''}
              // required 
            />
            {questionError && <p className="error-message">This field is required</p>}
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

export default Request;
