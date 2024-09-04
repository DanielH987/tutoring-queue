import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Queue from './components/Queue';
import AddToQueue from './components/AddToQueue';
import TutorDashboard from './components/TutorDashboard';
import StudentView from './components/StudentView';
import About from './components/About';
import Privacy from './components/Privacy';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Queue />} />
            <Route path="/add" element={<AddToQueue />} />
            <Route path="/tutor" element={<TutorDashboard />} />
            <Route path="/student" element={<StudentView />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
