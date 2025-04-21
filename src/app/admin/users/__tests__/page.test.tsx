import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserManagementPage from '../page';
import { useAuth } from 'bndy-ui';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase';

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

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  getFirebaseFirestore: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe('UserManagementPage Component', () => {
  // Mock router
  const mockRouter = {
    push: jest.fn(),
  };

  // Mock Firestore data
  const mockUsers = [
    {
      id: 'user1',
      displayName: 'Test User 1',
      email: 'user1@example.com',
      roles: ['user'],
    },
    {
      id: 'user2',
      displayName: 'Test Admin',
      email: 'admin@example.com',
      roles: ['admin', 'user'],
    },
  ];

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    // Mock Firestore
    const mockFirestore = {};
    (getFirebaseFirestore as jest.Mock).mockReturnValue(mockFirestore);
    
    // Mock collection function
    (collection as jest.Mock).mockReturnValue({});
    
    // Mock getDocs function
    (getDocs as jest.Mock).mockResolvedValue({
      forEach: (callback: (doc: any) => void) => {
        mockUsers.forEach(user => {
          callback({
            id: user.id,
            data: () => user,
          });
        });
      },
    });
    
    // Mock doc function
    (doc as jest.Mock).mockReturnValue({});
    
    // Mock updateDoc function
    (updateDoc as jest.Mock).mockResolvedValue({});
  });

  test('redirects to login page when user is not authenticated', async () => {
    // Mock the useAuth hook to return a non-authenticated state
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: null,
      isLoading: false,
    });

    render(<UserManagementPage />);
    
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

    render(<UserManagementPage />);
    
    // Wait for the useEffect to run
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  test('displays users when admin is authenticated', async () => {
    // Mock the useAuth hook to return an authenticated state with admin role
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        uid: 'admin-uid',
        email: 'admin@example.com',
        roles: ['admin'],
        displayName: 'Admin User',
      },
      isLoading: false,
    });

    render(<UserManagementPage />);
    
    // Wait for the component to render and fetch users
    await waitFor(() => {
      // Check if user management heading is visible
      expect(screen.getByText('User Management')).toBeInTheDocument();
      
      // Check if users are displayed
      expect(screen.getByText('Test User 1')).toBeInTheDocument();
      expect(screen.getByText('Test Admin')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });
  });

  test('allows searching for users', async () => {
    // Mock the useAuth hook to return an authenticated state with admin role
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        uid: 'admin-uid',
        email: 'admin@example.com',
        roles: ['admin'],
        displayName: 'Admin User',
      },
      isLoading: false,
    });

    render(<UserManagementPage />);
    
    // Wait for the component to render and fetch users
    await waitFor(() => {
      // Both users should be visible initially
      expect(screen.getByText('Test User 1')).toBeInTheDocument();
      expect(screen.getByText('Test Admin')).toBeInTheDocument();
    });
    
    // Find the search input and type 'admin'
    const searchInput = screen.getByPlaceholderText('Search users...');
    fireEvent.change(searchInput, { target: { value: 'admin' } });
    
    // Only the admin user should be visible
    await waitFor(() => {
      expect(screen.queryByText('Test User 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Admin')).toBeInTheDocument();
    });
  });

  // This test would be more comprehensive in a real implementation
  test('allows updating user roles', async () => {
    // Mock the useAuth hook to return an authenticated state with admin role
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        uid: 'admin-uid',
        email: 'admin@example.com',
        roles: ['admin'],
        displayName: 'Admin User',
      },
      isLoading: false,
    });

    render(<UserManagementPage />);
    
    // Wait for the component to render and fetch users
    await waitFor(() => {
      expect(screen.getByText('Test User 1')).toBeInTheDocument();
    });
    
    // Find and click the edit button for the first user
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    // Check if the role checkboxes are displayed
    await waitFor(() => {
      expect(screen.getByText('Available Roles')).toBeInTheDocument();
    });
    
    // In a more comprehensive test, we would:
    // 1. Check/uncheck role checkboxes
    // 2. Click save button
    // 3. Verify updateDoc was called with correct parameters
    // 4. Verify UI updates accordingly
  });
});
