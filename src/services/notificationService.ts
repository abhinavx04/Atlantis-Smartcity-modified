import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Notification } from '../types/notification';

export const notificationService = {
  createNotification: async (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    return addDoc(collection(db, 'notifications'), {
      ...notification,
      read: false,
      createdAt: Timestamp.now()
    });
  },

  subscribeToNotifications: (userId: string, callback: (notifications: Notification[]) => void) => {
    const q = query(
      collection(db, 'notifications'),
      where('toUserId', '==', userId),
      where('read', '==', false)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      callback(notifications);
    });
  },

  markAsRead: async (notificationId: string) => {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
  }
};