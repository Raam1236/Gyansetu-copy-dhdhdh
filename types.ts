

export enum PostType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
}

export type CallType = 'video' | 'voice';
export type Theme = 'light' | 'dark' | 'system';

// Base user type
export interface User {
  id: string;
  role: UserRole;
  firstName: string;
  lastName:string;
  username: string;
  email: string; // Now mandatory for authentication
  password?: string; // Added for password-based auth simulation
  mobile: string; // Now mandatory for authentication
  profilePictureUrl: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}

// Guru extends User with specific fields
export interface Guru extends User {
  role: 'guru';
  age: number;
  expertise: string;
  bio: string;
  rating: number;
  reviews: number;
  upiId: string;
}

// Shishya extends User
export interface Shishya extends User {
  role: 'shishya';
}

export type LoggedInUser = Guru | Shishya;


export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
}

export interface Post {
  id: string;
  guru: Guru;
  type: PostType;
  title: string;
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface CallRecord {
  id: string;
  callerId: string;
  callerName: string;
  callerProfilePic: string;
  receiverId: string;
  receiverName: string;
  receiverProfilePic: string;
  type: CallType;
  timestamp: string;
  duration: number; // in seconds
}

export interface CommissionRecord {
  id: string;
  postId: string;
  guruName: string;
  shishyaName: string;
  totalAmount: number;
  commissionAmount: number;
  timestamp: string;
}

export interface FeedbackRecord {
  id: string;
  feedbackText: string;
  timestamp: string;
}

export type ActivePage = 'home' | 'discover' | 'create' | 'profile';

export type UserRole = 'guru' | 'shishya';

// For storing users in localStorage, password is now needed for login simulation
export type StoredUser = Guru | Shishya;