import { Timestamp, GeoPoint } from 'firebase/firestore';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  location: GeoPoint;
  createdBy: string;
  createdAt: Timestamp;
  deadline: Timestamp;
  status: IssueStatus;
  votes: number;
  voterIds: string[];
  encryptedData?: string;
}

export interface Vote {
  id: string;
  issueId: string;
  userId: string;
  timestamp: Timestamp;
  verificationHash: string;
  deviceInfo: string;
}

export type IssueCategory = 
  | 'INFRASTRUCTURE'
  | 'WATER'
  | 'WASTE'
  | 'TRANSPORTATION'
  | 'SAFETY'
  | 'OTHER';

export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IssueStatus = 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export const ISSUE_CATEGORIES: IssueCategory[] = [
  'INFRASTRUCTURE',
  'WATER',
  'WASTE',
  'TRANSPORTATION',
  'SAFETY',
  'OTHER'
];

export const ISSUE_SEVERITIES: IssueSeverity[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
];