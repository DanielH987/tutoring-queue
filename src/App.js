import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Queue from './components/Queue';
import AddToQueue from './components/AddToQueue';
import TutorDashboard from './components/TutorDashboard';
import StudentView from './components/StudentView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Queue />} />
        <Route path="/add" element={<AddToQueue />} />
        <Route path="/tutor" element={<TutorDashboard />} />
        <Route path="/student" element={<StudentView />} />
      </Routes>
    </Router>
  );
}

export default App;
