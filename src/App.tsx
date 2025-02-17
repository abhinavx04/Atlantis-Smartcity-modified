import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Home from './components/Home/Home';
import Announcement from './components/Announcement';
import Emergency from './components/Emergency/Emergency';
import Events from './components/Events'; // Import Events component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/announcements" element={<Announcement />} /> {/* Changed to lowercase */}
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/events" element={<Events />} /> {/* Changed to lowercase */}
      </Routes>
    </Router>
  );
}

export default App;