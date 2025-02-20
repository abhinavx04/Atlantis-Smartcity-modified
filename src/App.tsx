import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Home from './components/Home/Home';
import Announcement from './components/Announcement/Announcement';
import Emergency from './components/Emergency/Emergency';
import Events from './components/Events';
import Transportation from './components/Transportations/Transportation';
import Chatbot from './components/Chatbot';
import ProfilePage from './components/ProfilePage';
import { CommunityChannel } from './components/Community/CommunityChannel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={
          <div className="relative min-h-screen">
            <Home />
            <div className="fixed bottom-4 right-4 z-50">
              <Chatbot />
            </div>
          </div>
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
        <Route path="/community" element={
          <div className="relative min-h-screen">
            <CommunityChannel />
            <div className="fixed bottom-4 right-4 z-50">
              <Chatbot />
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;