export class Config {
    public readonly blockchainUrl: string;
  
    constructor() {
      this.blockchainUrl = process.env.BLOCKCHAIN_URL || 'http://localhost:8545';
    }
  }