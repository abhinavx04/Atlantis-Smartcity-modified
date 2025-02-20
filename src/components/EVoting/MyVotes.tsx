import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Issue, Vote } from '../../types/voting';

interface VoteWithIssue extends Vote {
  issue?: Issue;
}

const MyVotes: React.FC = () => {
  const [votes, setVotes] = useState<VoteWithIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserVotes();
  }, []);

  const loadUserVotes = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const votesRef = collection(db, 'votes');
      const q = query(votesRef, where('userId', '==', auth.currentUser.uid));
      const votesSnapshot = await getDocs(q);

      const votesWithIssues: VoteWithIssue[] = [];

      for (const voteDoc of votesSnapshot.docs) {
        const vote = voteDoc.data() as Vote;
        
        // Get the issue details
        const issueRef = collection(db, 'issues');
        const issueDoc = await getDocs(query(issueRef, where('id', '==', vote.issueId)));
        
        if (!issueDoc.empty) {
          const issue = issueDoc.docs[0].data() as Issue;
          votesWithIssues.push({ ...vote, issue });
        } else {
          votesWithIssues.push(vote);
        }
      }

      setVotes(votesWithIssues);
    } catch (error: any) {
      setError(error.message);
      console.error('Error loading votes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold mb-6">My Votes</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : votes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {votes.map((vote) => (
            <div
              key={vote.id}
              className="bg-white rounded-lg shadow-md overflow-hidden p-6"
            >
              {vote.issue ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    {vote.issue.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {vote.issue.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>
                      Category: {vote.issue.category}
                    </div>
                    <div>
                      Voted on: {new Date(vote.timestamp.toDate()).toLocaleDateString()}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Issue no longer available</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't voted on any issues yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyVotes;