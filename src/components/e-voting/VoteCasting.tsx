import React, { useState } from 'react';
import axios from 'axios';

const VoteCasting: React.FC = () => {
  const [voterId, setVoterId] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [message, setMessage] = useState('');

  const castVote = async () => {
    try {
      const response = await axios.post('/api/voting', { voterId, candidateId });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error casting vote');
    }
  };

  return (
    <div>
      <h2>Cast Your Vote</h2>
      <input
        type="text"
        value={voterId}
        onChange={(e) => setVoterId(e.target.value)}
        placeholder="Enter your Voter ID"
      />
      <input
        type="text"
        value={candidateId}
        onChange={(e) => setCandidateId(e.target.value)}
        placeholder="Enter Candidate ID"
      />
      <button onClick={castVote}>Vote</button>
      <p>{message}</p>
    </div>
  );
};

export default VoteCasting;