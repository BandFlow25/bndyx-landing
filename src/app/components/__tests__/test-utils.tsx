import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
// Import centralized types from bndy-types
import type { BndyUser, AuthContextType } from 'bndy-types';

// Re-export the types for convenience in tests
export type { BndyUser, AuthContextType };

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
