import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { otpService } from '../../services/otpService';
import { auth, db } from '../../firebase/config';
import { addDoc, collection } from 'firebase/firestore';

interface IssueForm {
  title: string;
  description: string;
  category: string;
  deadline: string;
  phoneNumber: string;
}

const CreateIssue: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IssueForm>({
    title: '',
    description: '',
    category: '',
    deadline: '',
    phoneNumber: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    otpService.setupRecaptcha('recaptcha-container');
  }, []);

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const result = await otpService.sendOtp(formData.phoneNumber);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      await confirmationResult.confirm(otp);
      handleSubmitIssue();
    } catch (error: any) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIssue = async () => {
    try {
      const issueData = {
        ...formData,
        createdAt: new Date(),
        status: 'active',
        votes: 0,
        createdBy: auth.currentUser?.uid,
        voters: []
      };

      await addDoc(collection(db, 'issues'), issueData);
      navigate('/vote');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl text-white font-medium mb-6">Create New Issue</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form className="space-y-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Issue Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter a clear, concise title"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 h-32"
            placeholder="Provide detailed information about the issue"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {!otpSent ? (
          <>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({...prev, phoneNumber: e.target.value}))}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                placeholder="+91 your phone number"
                required
              />
            </div>
            <div id="recaptcha-container"></div>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter 6-digit OTP"
              required
            />
            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Submit'}
              </button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="bg-gray-700 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateIssue;