export interface EVoting {
    registerVoter(email: string): Promise<void>;
    castVote(voterId: string, candidateId: string): Promise<void>;
  }