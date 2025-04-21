import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Define types for our mock
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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  error: Error | null;
}

// Create a mock AuthContext
export const mockAuthContext: AuthContextType = {
  currentUser: null,
  isLoading: false,
  signOut: jest.fn().mockResolvedValue(undefined),
  signIn: jest.fn().mockResolvedValue(undefined),
  signUp: jest.fn().mockResolvedValue(undefined),
  resetPassword: jest.fn().mockResolvedValue(undefined),
  error: null,
};

// Create a mock AuthContext
export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Create a custom render function that includes the AuthProvider
export const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };
