// Type definitions for bndy-ui components and hooks
import { ReactNode } from 'react';
import { 
  BndyUser, 
  UserRole, 
  AuthError, 
  AuthErrorCategory,
  AuthContextType,
  AuthProviderProps
} from 'bndy-types';

// Re-export the types from bndy-types
export { 
  BndyUser, 
  UserRole, 
  AuthError, 
  AuthErrorCategory,
  AuthContextType,
  AuthProviderProps
};

// Auth context type and props are now imported from bndy-types

// Declare module for bndy-ui
declare module 'bndy-ui' {
  // Auth components and hooks
  export const AuthProvider: React.FC<AuthProviderProps>;
  export function useAuth(): AuthContextType;
  export const BndyLogo: React.FC<{
    className?: string;
    color?: string;
    holeColor?: string;
    forceDarkMode?: boolean;
  }>;
  
  // Add other components as needed
}
