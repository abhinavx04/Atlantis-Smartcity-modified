import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import AdminAnnouncement from './AdminAnnouncement';
import UserRequestForm from './UserRequestForm';
import { Announcement as AnnouncementType, AnnouncementRequest } from '../../types/announcement';
import { collection, query, orderBy, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { checkAdminStatus } from '../../utils/authUtils';

const Announcement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [requests, setRequests] = useState<AnnouncementRequest[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string>('');

  const fetchAnnouncements = async () => {
    try {
      const announcementsRef = collection(db, 'announcements');
      const q = query(announcementsRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const fetchedAnnouncements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AnnouncementType[];
      setAnnouncements(fetchedAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      console.log('🔄 Fetching requests...');
      const requestsRef = collection(db, 'announcementRequests');
      const q = query(requestsRef, where('status', '==', 'pending'));
      const snapshot = await getDocs(q);
      
      const fetchedRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('📥 Fetched requests:', fetchedRequests);
      setRequests(fetchedRequests);
    } catch (error) {
      console.error('❌ Error fetching requests:', error);
    }
  };

  const handleCreateAnnouncement = async (announcement: Omit<AnnouncementType, 'id' | 'createdBy' | 'updatedAt'>) => {
    try {
      const newAnnouncement = {
        ...announcement,
        createdBy: currentUser,
        date: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const announcementsRef = collection(db, 'announcements');
      await addDoc(announcementsRef, newAnnouncement);
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const handleUpdateAnnouncement = async (id: string, updates: Partial<AnnouncementType>) => {
    try {
      const announcementRef = doc(db, 'announcements', id);
      await updateDoc(announcementRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      console.log('🗑️ Deleting announcement/request:', id);
      // Try to delete from both collections
      await deleteDoc(doc(db, 'announcements', id));
      await deleteDoc(doc(db, 'announcementRequests', id));
      
      // Refresh both lists
      await fetchAnnouncements();
      await fetchRequests();
      
      console.log('✅ Delete successful');
    } catch (error) {
      console.error('❌ Error deleting:', error);
    }
  };

  const handleSubmitRequest = async (request: { title: string; description: string }) => {
    try {
      console.log('📝 Submitting request...');
      const requestData = {
        ...request,
        status: 'pending',
        requestedBy: currentUser,
        date: new Date().toISOString(),
        priority: 'medium',
        category: 'general'
      };

      const docRef = await addDoc(collection(db, 'announcementRequests'), requestData);
      console.log('✅ Request submitted with ID:', docRef.id);

      // Refresh requests immediately after submission
      await fetchRequests();
      return true;
    } catch (error) {
      console.error('❌ Error submitting request:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('👤 Auth state changed:', user?.email);
      
      if (user) {
        setCurrentUser(user.email || user.uid);
        const adminStatus = await checkAdminStatus(user);
        setIsAdmin(adminStatus);
        
        // Only fetch data after admin status is confirmed
        try {
          console.log('📢 Fetching announcements...');
          await fetchAnnouncements();
          
          if (adminStatus) {
            console.log('🔄 Fetching requests for admin...');
            await fetchRequests();
          }
        } catch (error) {
          console.error('🚫 Error fetching data:', error);
        }
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isAdmin) {
        console.log('👑 Admin detected, fetching requests...');
        await fetchRequests();
      }
    };

    fetchData();
  }, [isAdmin]); // Add isAdmin as dependency

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-5" />
      </div>

      <Navbar currentTime="2025-02-19 05:55:49" currentUser={currentUser} />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-7xl font-['Syncopate'] text-white mb-4 tracking-wider">
                ANNOUNCEMENTS
              </h1>
              <p className="text-2xl md:text-3xl text-blue-400/80 text-center mb-12 font-light">
                Stay updated with city-wide announcements
              </p>
            </motion.div>

            {isAdmin ? (
              <AdminAnnouncement
                announcements={announcements}
                requests={requests}
                onCreateAnnouncement={handleCreateAnnouncement}
                onUpdateAnnouncement={handleUpdateAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
              />
            ) : (
              <div className="space-y-8">
                {/* Display announcements first */}
                <div className="space-y-6 max-w-4xl mx-auto">
                  {announcements.map((announcement) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`w-full p-6 rounded-xl backdrop-blur-sm ${
                        announcement.priority === 'high' 
                          ? 'bg-red-900/30 border border-red-500/30' 
                          : announcement.priority === 'medium'
                          ? 'bg-yellow-900/30 border border-yellow-500/30'
                          : 'bg-green-900/30 border border-green-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-6">
                        {announcement.image && (
                          <img
                            src={announcement.image}
                            alt={announcement.title}
                            className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-grow">
                          <div className={`${
                            announcement.priority === 'high' ? 'border-l-4 border-red-500 pl-4' :
                            announcement.priority === 'medium' ? 'border-l-4 border-yellow-500 pl-4' :
                            'border-l-4 border-green-500 pl-4'
                          }`}>
                            <h3 className="text-2xl text-white font-semibold mb-3">{announcement.title}</h3>
                            <p className="text-gray-300 text-lg mb-4">{announcement.description}</p>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-4">
                              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                                announcement.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                'bg-green-500/20 text-green-400 border border-green-500/30'
                              }`}>
                                {announcement.priority.toUpperCase()}
                              </span>
                              <span className="text-gray-400">
                                {new Date(announcement.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {announcement.category && (
                              <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full text-sm">
                                {announcement.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Request form below announcements */}
                <div className="mt-12">
                  <h2 className="text-3xl font-['Syncopate'] text-white mb-6 text-center">
                    Submit an Announcement
                  </h2>
                  <UserRequestForm onSubmit={handleSubmitRequest} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Announcement;