export interface Announcement {
    id: string;
    title: string;
    description: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
    category: 'general' | 'emergency' | 'event' | 'maintenance';
    image?: string;
    createdBy: string;
    updatedAt: string;
  }
  
  export interface AnnouncementRequest {
    id: string;
    title: string;
    description: string;
    requestedBy: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
  }