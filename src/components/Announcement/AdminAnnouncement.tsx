import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Announcement, AnnouncementRequest } from '../../types/announcement';

interface AdminAnnouncementProps {
  announcements: any[];
  requests: any[];
  onCreateAnnouncement: (data: any) => Promise<void>;
  onUpdateAnnouncement: (id: string, data: any) => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
}

const AdminAnnouncement: React.FC<AdminAnnouncementProps> = ({
  announcements,
  requests,
  onCreateAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
}) => {
  console.log('📊 Admin Component Rendering with:', {
    announcementsCount: announcements.length,
    requestsCount: requests.length,
    requests: requests
  });

  const [isCreating, setIsCreating] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'general' as const,
    image: ''
  });
  const [showPending, setShowPending] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAnnouncement(newAnnouncement);
    setIsCreating(false);
    setNewAnnouncement({
      title: '',
      description: '',
      priority: 'medium',
      category: 'general',
      image: ''
    });
  };

  const handleApproveRequest = async (request: any) => {
    try {
      // Create new announcement from request
      await onCreateAnnouncement({
        title: request.title,
        description: request.description,
        priority: request.priority || 'medium',
        date: new Date().toISOString(),
      });

      // Update request status to approved
      await onUpdateAnnouncement(request.id, { status: 'approved' });
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  // Update the handleDeclineRequest function
  const handleDeclineRequest = async (requestId: string) => {
    try {
      console.log('🗑️ Declining request:', requestId);
      // Call onDeleteAnnouncement instead of onUpdateAnnouncement
      await onDeleteAnnouncement(requestId);
      // The parent component should handle refreshing the requests list
    } catch (error) {
      console.error('❌ Error declining request:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create New Announcement Section */}
      <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-['Syncopate'] text-white">Manage Announcements</h2>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {isCreating ? 'Cancel' : 'Create New'}
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              required
            />
            <textarea
              placeholder="Description"
              value={newAnnouncement.description}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg h-32"
              required
            />
            <div className="flex gap-4">
              <select
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <select
                value={newAnnouncement.category}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value as any })}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg"
              >
                <option value="general">General</option>
                <option value="emergency">Emergency</option>
                <option value="event">Event</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={newAnnouncement.image}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, image: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Create Announcement
            </button>
          </form>
        )}
      </div>

      {/* Pending Requests Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-['Syncopate'] text-white">
            Pending Requests
            {requests.length > 0 && (
              <span className="ml-3 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                {requests.length}
              </span>
            )}
          </h2>
          <button
            onClick={() => setShowPending(!showPending)}
            className="text-gray-400 hover:text-white transition"
          >
            {showPending ? 'Hide' : 'Show'}
          </button>
        </div>

        {showPending && (
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50"
                >
                  <h3 className="text-lg text-white font-medium mb-2">{request.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{request.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Requested by: {request.requestedBy}
                      <br />
                      {new Date(request.date).toLocaleDateString()}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleDeclineRequest(request.id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleApproveRequest(request)}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No pending requests</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Existing Announcements Section */}
      <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm">
        <h2 className="text-2xl font-['Syncopate'] text-white mb-6">Current Announcements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((announcement) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 p-6 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg text-white font-semibold">{announcement.title}</h3>
                <button
                  onClick={() => onDeleteAnnouncement(announcement.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-300 mt-2">{announcement.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-sm ${
                  announcement.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                </span>
                <span className="text-gray-400 text-sm">{announcement.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncement;