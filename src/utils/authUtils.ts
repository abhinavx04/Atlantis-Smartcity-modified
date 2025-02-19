import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const checkAdminStatus = async (user: any) => {
  try {
    console.log('🔍 Checking admin status for:', user.email);
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log('📄 User data found:', userData);
      return userData.isAdmin === true;
    } else {
      // Create new user document if it doesn't exist
      const newUserData = {
        email: user.email,
        isAdmin: user.email === 'abhinavpillai92@gmail.com',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      await setDoc(userDocRef, newUserData);
      console.log('✨ Created new user document:', newUserData);
      return newUserData.isAdmin;
    }
  } catch (error) {
    console.error('❌ Error checking admin status:', error);
    return false;
  }
};