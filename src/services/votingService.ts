import { db } from '../firebase/config';
import { 
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  GeoPoint,
  getDocs
} from 'firebase/firestore';
import { 
  Issue,
  IssueCategory,
  IssueSeverity,
  IssueStatus,
  Vote 
} from '../types/voting';

class VotingService {
  private issuesCollection = collection(db, 'issues');
  private votesCollection = collection(db, 'votes');

  async createIssue(issue: Omit<Issue, 'id' | 'votes' | 'voterIds' | 'createdAt' | 'deadline'>) {
    try {
      const now = Timestamp.now();
      const deadline = new Timestamp(
        now.seconds + (30 * 24 * 60 * 60), // 30 days in seconds
        now.nanoseconds
      );

      const newIssue = {
        ...issue,
        createdAt: now,
        deadline,
        votes: 0,
        voterIds: [],
        status: 'PENDING' as IssueStatus
      };

      const docRef = await addDoc(this.issuesCollection, newIssue);
      return docRef.id;
    } catch (error) {
      console.error('Error creating issue:', error);
      throw error;
    }
  }

  async voteForIssue(issueId: string, userId: string, deviceInfo: string) {
    try {
      // Check if user has already voted
      const issueRef = doc(this.issuesCollection, issueId);
      const issueDoc = await getDoc(issueRef);

      if (!issueDoc.exists()) {
        throw new Error('Issue not found');
      }

      const issueData = issueDoc.data() as Issue;
      if (issueData.voterIds.includes(userId)) {
        throw new Error('User has already voted');
      }

      // Create vote record
      const vote: Omit<Vote, 'id'> = {
        issueId,
        userId,
        timestamp: Timestamp.now(),
        deviceInfo,
        verificationHash: this.generateVerificationHash(userId, issueId, deviceInfo)
      };

      // Add vote and update issue
      await Promise.all([
        addDoc(this.votesCollection, vote),
        updateDoc(issueRef, {
          votes: increment(1),
          voterIds: [...issueData.voterIds, userId]
        })
      ]);

      return true;
    } catch (error) {
      console.error('Error voting for issue:', error);
      throw error;
    }
  }

  private generateVerificationHash(userId: string, issueId: string, deviceInfo: string): string {
    // Simple hash function - can be replaced with more secure one
    const str = `${userId}-${issueId}-${deviceInfo}-${Date.now()}`;
    return Array.from(str)
      .reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0)
      .toString(36);
  }

  async getTopIssues(category?: IssueCategory, limit: number = 10) {
    try {
      let q = query(
        this.issuesCollection,
        orderBy('votes', 'desc'),
        limit
      );

      if (category) {
        q = query(q, where('category', '==', category));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Issue[];
    } catch (error) {
      console.error('Error getting top issues:', error);
      throw error;
    }
  }
}

export const votingService = new VotingService();