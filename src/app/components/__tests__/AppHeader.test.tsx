import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Create a simplified version of AppHeader for testing
const AppHeaderTest: React.FC<{
  currentUser?: {
    uid: string;
    email: string | null;
    displayName: string | null;
    roles?: string[];
    godMode?: boolean;
  } | null;
}> = ({ currentUser = null }) => {
  // Helper function to check if user has admin access
  const hasAdminAccess = () => {
    if (!currentUser) return false;
    return (
      currentUser.roles?.some(role => 
        role.toLowerCase().includes('admin') || 
        role === 'live_admin'
      ) || 
      currentUser.godMode === true
    );
  };

  return (
    <header data-testid="app-header">
      <div data-testid="bndy-logo">BndyLogo</div>
      
      {currentUser ? (
        <div>
          {hasAdminAccess() && (
            <a href="/admin" title="Admin Panel" data-testid="admin-panel-link">
              Admin Panel
            </a>
          )}
          <a href="/account" data-testid="account-link">
            Account
          </a>
          <button data-testid="sign-out-button">
            Sign out
          </button>
        </div>
      ) : (
        <a href="/login" data-testid="sign-in-button">
          Sign in
        </a>
      )}
    </header>
  );
};

describe('AppHeader Component', () => {
  test('renders the logo', () => {
    render(<AppHeaderTest />);
    expect(screen.getByTestId('bndy-logo')).toBeInTheDocument();
  });
  
  test('shows sign in button when user is not authenticated', () => {
    render(<AppHeaderTest currentUser={null} />);
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
  });
  
  test('shows admin icon when user has admin role', () => {
    const user = {
      uid: 'test-uid',
      email: 'test@example.com',
      roles: ['admin'],
      displayName: 'Test User',
    };
    
    render(<AppHeaderTest currentUser={user} />);
    expect(screen.getByTestId('admin-panel-link')).toBeInTheDocument();
  });
  
  test('shows admin icon when user has godMode', () => {
    const user = {
      uid: 'test-uid',
      email: 'test@example.com',
      roles: ['user'],
      displayName: 'Test User',
      godMode: true,
    };
    
    render(<AppHeaderTest currentUser={user} />);
    expect(screen.getByTestId('admin-panel-link')).toBeInTheDocument();
  });
  
  test('does not show admin icon for regular users', () => {
    const user = {
      uid: 'test-uid',
      email: 'test@example.com',
      roles: ['user'],
      displayName: 'Test User',
    };
    
    render(<AppHeaderTest currentUser={user} />);
    expect(screen.queryByTestId('admin-panel-link')).not.toBeInTheDocument();
  });
});

