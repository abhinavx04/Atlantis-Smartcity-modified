import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeoPoint } from 'firebase/firestore';
import { votingService } from '../../services/votingService';
import { ISSUE_CATEGORIES, ISSUE_SEVERITIES, IssueCategory, IssueSeverity } from '../../types/voting';
import { auth } from '../../firebase/config';

const CreateIssue: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as IssueCategory,
    severity: '' as IssueSeverity,
    location: {
      address: '',
      latitude: 0,
      longitude: 0
    }
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
        },
        (error) => {
          setLocationError('Unable to get your location. Please enter it manually.');
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to create an issue');
      }

      const issue = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        severity: formData.severity,
        location: new GeoPoint(formData.location.latitude, formData.location.longitude),
        createdBy: user.uid
      };

      const issueId = await votingService.createIssue(issue);
      console.log('Issue created successfully:', issueId);
      navigate('/voting/issues'); // Redirect to issues list
    } catch (error: any) {
      setError(error.message || 'Failed to create issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Issue</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter issue title"
              required
              minLength={10}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the issue in detail"
              required
              rows={4}
              minLength={50}
              maxLength={1000}
            />
          </div>

          {/* Category and Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as IssueCategory }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                {ISSUE_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as IssueSeverity }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Severity</option>
                {ISSUE_SEVERITIES.map(severity => (
                  <option key={severity} value={severity}>
                    {severity.charAt(0) + severity.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            {locationError && (
              <p className="text-yellow-600 text-sm mb-2">{locationError}</p>
            )}
            <input
              type="text"
              value={formData.location.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, address: e.target.value }
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter location details"
              required
            />
            {userLocation && (
              <p className="mt-2 text-sm text-gray-500">
                Using your current location: {userLocation.coords.latitude.toFixed(6)}, {userLocation.coords.longitude.toFixed(6)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`
                px-6 py-2 rounded-lg text-white font-medium
                ${loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                }
                transition-colors duration-200
              `}
            >
              {loading ? 'Creating...' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIssue;