import { Blockchain } from './blockchain';
import { sendWelcomeEmail } from './mailer';
import { Config } from './config';
import { Firestore } from '@google-cloud/firestore';

export class EVoting {
  private blockchain: Blockchain;
  private config: Config;
  private db: Firestore;

  constructor() {
    this.blockchain = new Blockchain();
    this.config = new Config();
    this.db = new Firestore();
  }

  public async registerVoter(email: string) {
    const otp = this.generateOTP();
    await sendWelcomeEmail(email, otp);
    await this.db.collection('voters').add({
      email,
      otp,
      registeredAt: new Date(),
    });
  }

  private generateOTP(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  public async castVote(voterId: string, candidateId: string) {
    const voterRef = this.db.collection('voters').doc(voterId);
    const voterDoc = await voterRef.get();

    if (!voterDoc.exists) {
      throw new Error('Voter not registered');
    }

    if (voterDoc.data()?.hasVoted) {
      throw new Error('Voter has already voted');
    }

    await this.blockchain.castVote(voterId, candidateId);
    await voterRef.update({ hasVoted: true });
  }
}