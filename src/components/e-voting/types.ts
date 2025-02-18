export interface Vote {
  voterId: string;
  candidateId: string;
  timestamp: Date;
}

export interface Voter {
  email: string;
  otp: string;
  registeredAt: Date;
  hasVoted: boolean;
  lastVoteAt?: Date;
}