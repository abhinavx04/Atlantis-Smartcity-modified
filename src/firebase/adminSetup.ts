import { db } from './config';
import { doc, setDoc } from 'firebase/firestore';

// Use this function to set up initial admin users
export const setupAdminUser = async (uid: string, adminData: {
  email: string;
  name: string;
  role: string;
  department: string;
}) => {
  await setDoc(doc(db, 'admins', uid), {
    ...adminData,
    isAdmin: true,
    createdAt: new Date(),
    lastLogin: new Date()
  });
};