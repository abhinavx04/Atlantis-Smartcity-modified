import { db } from '../firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Announcement } from '../models/Announcement';

class AnnouncementService {
  private collectionRef = collection(db, 'announcements');

  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const announcementData = {
      ...announcement,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(this.collectionRef, announcementData);
    return docRef.id;
  }

  async getAnnouncements(): Promise<Announcement[]> {
    const querySnapshot = await getDocs(this.collectionRef);
    const announcements: Announcement[] = [];
    querySnapshot.forEach(doc => {
      announcements.push({ id: doc.id, ...doc.data() } as Announcement);
    });
    return announcements;
  }

  async updateAnnouncement(id: string, announcement: Partial<Announcement>): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await updateDoc(docRef, {
      ...announcement,
      updatedAt: serverTimestamp(),
    });
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
  }
}

export const announcementService = new AnnouncementService();