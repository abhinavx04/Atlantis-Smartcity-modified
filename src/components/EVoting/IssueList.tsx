import React, { useState, useEffect } from 'react';
import { votingService } from '../../services/votingService';
import { Issue, IssueCategory, ISSUE_CATEGORIES } from '../../types/voting';
import { auth } from '../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';

const IssueList: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null);

  useEffect(() => {
    loadIssues();
  }, [filter]);

  const loadIssues = async () => {
    try {
      const fetchedIssues = await votingService.getTopIssues(filter);
      setIssues(fetchedIssues);
    } catch (error) {
      setError('Failed to load issues');
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (issueId: string) => {
    if (!auth.currentUser) {
      setError('Please login to vote');
      return;
    }

    setVotingInProgress(issueId);
    try {
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timestamp: new Date().toISOString()
      };

      await votingService.voteForIssue(
        issueId,
        auth.currentUser.uid,
        JSON.stringify(deviceInfo)
      );
      await loadIssues();
    } catch (error: any) {
      setError(error.message || 'Failed to vote');
    } finally {
      setVotingInProgress(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All Issues
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg text-sm ${
            filter === 'active'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 rounded-lg text-sm ${
            filter === 'resolved'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Resolved
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {issues.map((issue) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl text-white font-medium mb-2">
                      {issue.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {issue.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleVote(issue.id)}
                    disabled={votingInProgress === issue.id || issue.voterIds?.includes(auth.currentUser?.uid || '')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      votingInProgress === issue.id || issue.voterIds?.includes(auth.currentUser?.uid || '')
                        ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                    }`}
                  >
                    {votingInProgress === issue.id
                      ? 'Voting...'
                      : issue.voterIds?.includes(auth.currentUser?.uid || '')
                        ? 'Voted'
                        : 'Vote'
                    }
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="text-gray-300">{issue.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="text-blue-400">
                      {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="text-gray-300">{formatDate(issue.createdAt.toDate())}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Deadline</p>
                    <p className="text-gray-300">{formatDate(issue.deadline.toDate())}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">by</span>
                    <span className="text-blue-400">{issue.creator}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🗳️</span>
                    <span className="text-white font-medium">{issue.votes}</span>
                    <span className="text-gray-400">votes</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default IssueList;