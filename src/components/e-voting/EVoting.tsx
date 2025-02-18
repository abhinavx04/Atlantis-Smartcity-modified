import React from 'react';
import VoterRegistration from './VoterRegistration';
import VoteCasting from './VoteCasting';

const EVoting: React.FC = () => {
  return (
    <div>
      <h1>EtherCast E-Voting System</h1>
      <VoterRegistration />
      <VoteCasting />
    </div>
  );
};

export default EVoting;