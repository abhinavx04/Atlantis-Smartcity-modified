import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { auth } from './config';

const db = getFirestore();

export const checkUserAdmin = async (uid: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      // Update last active timestamp
      await updateDoc(userRef, {
        lastActive: new Date().toISOString()
      });
      
      return userData?.isAdmin === true || userData?.role === 'admin';
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        ...userData,
        isAdmin: userData?.isAdmin === true || userData?.role === 'admin',
        lastActive: new Date().toISOString()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};