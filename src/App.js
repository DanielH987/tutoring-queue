import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Request from './components/Request';
import About from './components/About';
import Privacy from './components/Privacy';
import Instructions from './components/Instructions';
import Queue from './components/Queue';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Request />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
