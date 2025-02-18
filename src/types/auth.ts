export interface UserRole {
    isAdmin: boolean;
    role: 'admin' | 'user';
    permissions: string[];
  }
  
  export interface UserData {
    uid: string;
    email: string;
    displayName: string | null;
    role: UserRole;
    communityId?: string;
    lastLogin: Date;
    createdAt: Date;
  }
  
  export interface AdminData extends UserData {
    adminId: string;
    department: string;
    accessLevel: number;
  }