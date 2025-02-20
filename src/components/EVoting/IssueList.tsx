import React, { useState, useEffect } from 'react';
import { votingService } from '../../services/votingService';
import { Issue, IssueCategory, ISSUE_CATEGORIES } from '../../types/voting';
import { auth } from '../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';

const IssuesList: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'ALL'>('ALL');
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null);

  useEffect(() => {
    loadIssues();
  }, [selectedCategory]);

  const loadIssues = async () => {
    try {
      const fetchedIssues = await votingService.getTopIssues(
        selectedCategory === 'ALL' ? undefined : selectedCategory
      );
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
      
      // Reload issues after voting
      await loadIssues();
    } catch (error: any) {
      setError(error.message || 'Failed to vote');
    } finally {
      setVotingInProgress(null);
    }
  };

  const getTimeLeft = (deadline: Date) => {
    const now = new Date();
    const timeLeft = deadline.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      'LOW': 'bg-green-100 text-green-800 border-green-200',
      'MEDIUM': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'HIGH': 'bg-orange-100 text-orange-800 border-orange-200',
      'CRITICAL': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[severity as keyof typeof colors] || colors.LOW;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              ${selectedCategory === 'ALL'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            All Issues
          </button>
          {ISSUE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                ${selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 gap-6">
            {issues.map((issue) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {issue.title}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                        <span className="text-sm text-gray-500">
                          {issue.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {issue.votes}
                      </div>
                      <div className="text-sm text-gray-500">votes</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {issue.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Deadline:</span>{' '}
                      {getTimeLeft(issue.deadline.toDate())} days left
                    </div>
                    <button
                      onClick={() => handleVote(issue.id)}
                      disabled={votingInProgress === issue.id || issue.voterIds.includes(auth.currentUser?.uid || '')}
                      className={`
                        px-6 py-2 rounded-lg text-white font-medium
                        ${votingInProgress === issue.id
                          ? 'bg-blue-400 cursor-not-allowed'
                          : issue.voterIds.includes(auth.currentUser?.uid || '')
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                        }
                        transition-colors duration-200
                      `}
                    >
                      {votingInProgress === issue.id
                        ? 'Voting...'
                        : issue.voterIds.includes(auth.currentUser?.uid || '')
                          ? 'Voted'
                          : 'Vote'
                      }
                    </button>
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

export default IssuesList;