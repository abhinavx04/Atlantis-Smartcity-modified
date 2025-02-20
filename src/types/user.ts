export interface UserProfile {
    name: string;
    email: string | null;
    photoURL: string | null;
    isAdmin: boolean;
    uid: string;
    createdAt?: string;
    lastLogin?: string;
    lastActive?: string;
  }
  
  export interface ProfilePageProps {
    currentUser: string;
  }