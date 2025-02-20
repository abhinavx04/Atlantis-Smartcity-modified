import { Timestamp, GeoPoint } from 'firebase/firestore';

export type IssueCategory = 
  | 'INFRASTRUCTURE'
  | 'ENVIRONMENT'
  | 'SAFETY'
  | 'TRANSPORTATION'
  | 'EDUCATION'
  | 'HEALTHCARE'
  | 'OTHER';

export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IssueStatus = 'PENDING' | 'ACTIVE' | 'RESOLVED' | 'EXPIRED';

export const ISSUE_CATEGORIES: IssueCategory[] = [
  'INFRASTRUCTURE',
  'ENVIRONMENT',
  'SAFETY',
  'TRANSPORTATION',
  'EDUCATION',
  'HEALTHCARE',
  'OTHER'
];

export const ISSUE_SEVERITIES: IssueSeverity[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
];

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  location: GeoPoint;
  createdBy: string;
  votes: number;
  voterIds: string[];
  createdAt: Timestamp;
  deadline: Timestamp;
  status: IssueStatus;
}

export interface Vote {
  id: string;
  issueId: string;
  userId: string;
  timestamp: Timestamp;
  deviceInfo: string;
  verificationHash: string;
}