import React, { useState } from 'react';
import axios from 'axios';

const VoterRegistration: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const registerVoter = async () => {
    try {
      const response = await axios.post('/api/voting', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error registering voter');
    }
  };

  return (
    <div>
      <h2>Voter Registration</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button onClick={registerVoter}>Register</button>
      <p>{message}</p>
    </div>
  );
};

export default VoterRegistration;