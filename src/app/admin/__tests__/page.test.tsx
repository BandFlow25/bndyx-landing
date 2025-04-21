import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminPage from '../page';
import { useAuth } from 'bndy-ui';
import { useRouter } from 'next/navigation';

// Mock the useAuth hook
jest.mock('bndy-ui', () => ({
  ...jest.requireActual('bndy-ui'),
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('AdminPage Component', () => {
  // Mock router
  const mockRouter = {
    push: jest.fn(),
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('renders loading state when authentication is in progress', () => {
    // Mock the useAuth hook to return a loading state
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: null,
      isLoading: true,
    });

    render(<AdminPage />);
    
    // Check if loading indicator is rendered
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('redirects to login page when user is not authenticated', async () => {
    // Mock the useAuth hook to return a non-authenticated state
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: null,
      isLoading: false,
    });

    render(<AdminPage />);
    
    // Wait for the useEffect to run
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  test('redirects to home page when user does not have admin role', async () => {
    // Mock the useAuth hook to return an authenticated state without admin role
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        uid: 'test-uid',
        email: 'test@example.com',
        roles: ['user'],
        displayName: 'Test User',
      },
      isLoading: false,
    });

    render(<AdminPage />);
    
    // Wait for the useEffect to run
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  test('allows access when user has admin role', async () => {
    // Mock the useAuth hook to return an authenticated state with admin role
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        uid: 'test-uid',
        email: 'test@example.com',
        roles: ['admin'],
        displayName: 'Test User',
      },
      isLoading: false,
    });

    render(<AdminPage />);
    
    // Wait for the component to render
    await waitFor(() => {
      // Admin panel heading should be visible
      expect(screen.getByText('Admin Panel')).toBeInTheDocument();
      // Router should not redirect
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  test('allows access when user has godMode', async () => {
    // Mock the useAuth hook to return an authenticated state with godMode
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        uid: 'test-uid',
        email: 'test@example.com',
        roles: ['user'],
        godMode: true,
        displayName: 'Test User',
      },
      isLoading: false,
    });

    render(<AdminPage />);
    
    // Wait for the component to render
    await waitFor(() => {
      // Admin panel heading should be visible
      expect(screen.getByText('Admin Panel')).toBeInTheDocument();
      // Router should not redirect
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});
