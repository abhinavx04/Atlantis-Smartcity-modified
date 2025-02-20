import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Home from './components/Home/Home';
import Announcement from './components/Announcement/Announcement';
import Emergency from './components/Emergency/Emergency';
import Events from './components/Events';
import Transportation from './components/Transportations/Transportation';
import Chatbot from './components/Chatbot';
// Add new imports
import EVotingDashboard from './components/EVoting/EVotingDashboard';
import IssueList from './components/EVoting/IssueList';
import CreateIssue from './components/EVoting/CreateIssue';
import MyVotes from './components/EVoting/MyVotes';

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
        {/* Add E-Voting routes */}
        <Route path="/vote" element={
          <>
            <EVotingDashboard />
            <Chatbot />
          </>
        }>
          <Route index element={<IssueList />} />
          <Route path="create" element={<CreateIssue />} />
          <Route path="my-votes" element={<MyVotes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;