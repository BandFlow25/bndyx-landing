import React from 'react';

// Define the types for our mocked components and hooks
export interface BndyUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  roles?: string[];
  godMode?: boolean;
}

export interface AuthContextType {
  currentUser: BndyUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

// Mock the useAuth hook
export const useAuth = jest.fn().mockImplementation(() => ({
  currentUser: null,
  isLoading: false,
  signOut: jest.fn().mockResolvedValue(undefined),
}));

// Mock the AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Mock the BndyLogo component
export const BndyLogo: React.FC<{ className?: string }> = ({ className }) => {
  return <div data-testid="bndy-logo" className={className}>BndyLogo</div>;
};

// Export other components that might be used in tests
export const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props}>{children}</button>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} />
);

// Default export for the entire module
export default {
  useAuth,
  AuthProvider,
  BndyLogo,
  Button,
  Input,
};
