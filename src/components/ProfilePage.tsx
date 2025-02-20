import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { checkUserAdmin } from '../firebase/userUtils';
import { UserProfile } from '../types/user';
;
import Navbar from './Navbar';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    photoURL: null,
    isAdmin: false,
    uid: '',
    createdAt: '',
    lastLogin: '',
    lastActive: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const isUserAdmin = await checkUserAdmin(user.uid);
          
          setUserProfile({
            name: user.displayName || 'User',
            email: user.email,
            photoURL: user.photoURL,
            isAdmin: isUserAdmin,
            uid: user.uid,
            createdAt: user.metadata.creationTime || '',
            lastLogin: user.metadata.lastSignInTime || '',
            lastActive: new Date().toISOString()
          });
        } catch (err) {
          setError('Error loading profile data');
          console.error('Profile loading error:', err);
        }
      } else {
        navigate('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  if (loading) {
    return (
      <>
        <Navbar currentUser={userProfile.email || ''} />
        <LoadingSpinner />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar currentUser={userProfile.email || ''} />
        <ErrorMessage message={error} />
      </>
    );
  }

  return (
    <>
      <Navbar currentUser={userProfile.email || ''} />
      <ProfileStyles />
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="profile-card profile-border rounded-2xl p-8 mt-16">
            {/* Current Date/Time Display */}
            <div className="text-center mb-6">
              <p className="text-blue-400 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Current Time (UTC): {formatDateTime(currentDateTime)}
              </p>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col items-center">
              <div className="avatar-container mb-6">
                <img
                  src={userProfile.photoURL || defaultAvatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>

              {/* User Info */}
              <div className="text-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center justify-center space-x-3">
                    <h1 
                      className="text-3xl font-bold text-white"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {userProfile.name}
                    </h1>
                  </div>
                  
                  {userProfile.isAdmin && (
                    <div className="flex items-center space-x-2">
                      <span 
                        className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium animate-pulse"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        Logged in as Admin
                      </span>
                    </div>
                  )}
                  
                  <p 
                    className="text-gray-400"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {userProfile.email}
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    <span 
                      className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      Active Now
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <ProfileDetails 
                userProfile={userProfile}
                currentDateTime={currentDateTime}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="text-blue-400 text-xl animate-pulse">Loading...</div>
  </div>
);

// Error Message Component
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="text-red-400 text-xl">{message}</div>
  </div>
);

// Profile Details Component
const ProfileDetails: React.FC<{ 
  userProfile: UserProfile;
  currentDateTime: Date;
}> = ({ 
  userProfile,
  currentDateTime
}) => (
  <div className="w-full max-w-md mt-8">
    <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
      <DetailItem 
        label="Account Type" 
        value={userProfile.isAdmin ? 'Administrator' : 'Standard User'} 
      />
      <DetailItem 
        label="Member Since" 
        value={new Date(userProfile.createdAt || '').toLocaleDateString()} 
      />
      <DetailItem 
        label="Last Sign In" 
        value={new Date(userProfile.lastLogin || '').toLocaleDateString()} 
      />
      <DetailItem 
        label="Current Session Started" 
        value={new Date(userProfile.lastActive || '').toLocaleString()} 
      />
      <DetailItem 
        label="User ID" 
        value={userProfile.uid} 
      />
      <DetailItem 
        label="Status" 
        value="Online" 
        className="text-green-400"
      />
    </div>
  </div>
);

// Detail Item Component
const DetailItem: React.FC<{ 
  label: string; 
  value: string;
  className?: string;
}> = ({ 
  label, 
  value,
  className = "text-white"
}) => (
  <div>
    <label 
      className="block text-sm font-medium text-gray-400 mb-1"
      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
    >
      {label}
    </label>
    <p 
      className={`${className}`}
      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
    >
      {value}
    </p>
  </div>
);

// Styles Component
const ProfileStyles: React.FC = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');
      
      .profile-card {
        background: rgba(17, 24, 39, 0.8);
        backdrop-filter: blur(10px);
        animation: fadeIn 0.5s ease;
      }

      .profile-border {
        position: relative;
      }

      .profile-border::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 16px;
        padding: 2px;
        background: linear-gradient(
          45deg,
          rgba(59, 130, 246, 0.5),
          rgba(37, 99, 235, 0.5)
        );
        -webkit-mask: 
          linear-gradient(#fff 0 0) content-box, 
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .avatar-container {
        position: relative;
        display: inline-block;
      }

      .avatar-container::after {
        content: '';
        position: absolute;
        inset: -3px;
        border-radius: 50%;
        padding: 3px;
        background: linear-gradient(45deg, #3B82F6, #1E40AF);
        -webkit-mask: 
          linear-gradient(#fff 0 0) content-box, 
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
      }

      .status-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `}
  </style>
);

export default ProfilePage;