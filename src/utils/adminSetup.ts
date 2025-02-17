import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const createAdmin = async (email: string, password: string) => {
  try {
    // First create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Then create the admin document in Firestore
    await setDoc(doc(db, 'admins', user.uid), {
      uid: user.uid,
      email: email,
      displayName: "Admin User", // You can customize this
      isAdmin: true,
      permissions: ["create_announcement", "approve_requests", "manage_users"],
      createdAt: new Date(),
      lastLogin: new Date()
    });

    console.log("Admin created successfully");
    return user;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};