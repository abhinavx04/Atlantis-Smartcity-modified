import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Home from './components/Home/Home';
import Announcement from './components/Announcement';
import Emergency from './components/Emergency/Emergency';
import Events from './components/Events';
import Transportation from './components/Transportations/Transportation';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={
          <>
            <Home />
            <Chatbot />
          </>
        } />
        <Route path="/announcements" element={
          <>
            <Announcement />
            <Chatbot />
          </>
        } />
        <Route path="/emergency" element={
          <>
            <Emergency />
            <Chatbot />
          </>
        } />
        <Route path="/events" element={
          <>
            <Events />
            <Chatbot />
          </>
        } />
        <Route path="/transport" element={
          <>
            <Transportation />
            <Chatbot />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;