import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Home from './components/Home/Home';
import Announcement from './components/Announcement';
import Emergency from './components/Emergency/Emergency'
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <Chatbot />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/Announcement" element={<Announcement />} />
        <Route path="/Emergency" element={<Emergency />} />

        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;