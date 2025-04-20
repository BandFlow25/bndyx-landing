// src/types/admin.ts
// Simple type definitions for admin functionality

// Define the user type based on the Firestore structure
export interface FirestoreUser {
  id: string;
  email: string;
  displayName: string;
  fullName?: string;
  createdAt?: string | { seconds: number; nanoseconds: number };
  godMode?: boolean;
  hasProfile?: boolean;
  instruments?: string[];
  postcode?: string;
  roles?: string[];
  avatar?: string;
}
