'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from 'bndy-ui';
import { useRouter } from 'next/navigation';
import { 
  Users, Search, Loader2, CheckCircle, XCircle, 
  ChevronDown, ChevronUp, RefreshCw, Save
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase';
import { FirestoreUser } from '@/types/admin';

// Define available roles for the admin interface
type AdminRole = string;

// Available roles for the UI
const availableRoles: AdminRole[] = [
  'live_admin',
  'live_builder',
  'live_giggoer',
  'bndy_band',
  'bndy_artist',
  'bndy_venue',
  'bndy_agent',
  'bndy_studio',
  'user',
  'admin'
];

export default function UserManagementPage() {
  return (
    <AuthProvider>
      <UserManagementContent />
    </AuthProvider>
  );
}

function UserManagementContent() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<FirestoreUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<{[key: string]: string[]}>({});
  const [isSaving, setIsSaving] = useState<{[key: string]: boolean}>({});
  const [saveSuccess, setSaveSuccess] = useState<{[key: string]: boolean}>({});
  // Get Firestore instance
  const db = getFirebaseFirestore();

  // Debug user info and check admin access
  useEffect(() => {
    // Add a small delay to ensure auth state is fully loaded
    const checkAuth = setTimeout(() => {
      if (!isLoading) {
        if (currentUser) {
          // Log user details for debugging
          console.log('Users page - Current user:', {
            uid: currentUser.uid,
            email: currentUser.email,
            roles: currentUser.roles,
            godMode: (currentUser as any).godMode
          });
          
          // Check if user has admin access
          const hasAdminRole = Array.isArray(currentUser.roles) && currentUser.roles.includes('admin' as any);
          const hasGodMode = (currentUser as any).godMode === true;
          
          console.log('Admin access check:', { hasAdminRole, hasGodMode });
          
          // For development, allow access with admin role regardless of godMode
          if (hasAdminRole) {
            console.log('User has admin role, allowing access');
            // Don't redirect, allow access
          } else {
            console.log('User does not have admin access, redirecting to home');
            router.push('/');
          }
        } else {
          // No user logged in
          console.log('No user logged in, redirecting to login');
          router.push('/login');
        }
      }
    }, 500); // Small delay to ensure auth state is loaded
    
    return () => clearTimeout(checkAuth);
  }, [currentUser, isLoading, router]);

  // Fetch users when component mounts
  useEffect(() => {
    if (!isLoading && currentUser) {
      fetchUsers();
    }
  }, [currentUser, isLoading]);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setError(null);
    
    try {
      const usersCollection = collection(db, 'bf_users');
      const usersSnapshot = await getDocs(usersCollection);
      
      const usersData: FirestoreUser[] = [];
      
      usersSnapshot.forEach((doc) => {
        const userData = doc.data() as FirestoreUser;
        usersData.push({
          ...userData,
          id: doc.id,
          roles: userData.roles || [],
        });
      });
      
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      user => 
        user.email?.toLowerCase().includes(query) ||
        user.displayName?.toLowerCase().includes(query) ||
        user.fullName?.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
    );
    
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const toggleEditUser = (userId: string) => {
    if (editingUser === userId) {
      setEditingUser(null);
    } else {
      setEditingUser(userId);
    }
  };

  const toggleRole = (userId: string, role: string) => {
    const currentRoles = [...(selectedRoles[userId] || [])];
    const roleIndex = currentRoles.indexOf(role);
    
    if (roleIndex > -1) {
      currentRoles.splice(roleIndex, 1);
    } else {
      currentRoles.push(role);
    }
    
    setSelectedRoles({
      ...selectedRoles,
      [userId]: currentRoles
    });
  };

  const saveUserRoles = async (userId: string) => {
    if (!selectedRoles[userId]) {
      console.error('Cannot save roles: no roles selected');
      return;
    }
    
    setIsSaving({ ...isSaving, [userId]: true });
    setSaveSuccess({ ...saveSuccess, [userId]: false });
    
    try {
      const userRef = doc(db, 'bf_users', userId);
      
      await updateDoc(userRef, {
        roles: selectedRoles[userId]
      });
      
      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return { ...user, roles: selectedRoles[userId] };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers.filter(user => 
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      
      setSaveSuccess({ ...saveSuccess, [userId]: true });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(prev => ({ ...prev, [userId]: false }));
      }, 3000);
      
    } catch (err) {
      console.error('Error updating user roles:', err);
      alert('Failed to update user roles. Please try again.');
    } finally {
      setIsSaving({ ...isSaving, [userId]: false });
    }
  };

  const refreshUsers = async () => {
    if (!currentUser || !((currentUser.roles as any)?.includes('admin') || (currentUser as any).godMode === true)) {
      return;
    }
    
    try {
      setIsLoadingUsers(true);
      setError(null);
      
      const usersCollection = collection(db, 'bf_users');
      const usersSnapshot = await getDocs(usersCollection);
      
      const usersData: FirestoreUser[] = [];
      
      usersSnapshot.forEach((doc) => {
        const userData = doc.data() as FirestoreUser;
        usersData.push({
          ...userData,
          id: doc.id,
          roles: userData.roles || [],
        });
      });
      
      setUsers(usersData);
      setFilteredUsers(searchQuery ? 
        usersData.filter(
          user => 
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.toLowerCase().includes(searchQuery.toLowerCase())
        ) : 
        usersData
      );
      
      // Update selected roles with current user roles
      const updatedSelectedRoles: {[key: string]: string[]} = {};
      usersData.forEach(user => {
        updatedSelectedRoles[user.id] = user.roles || [];
      });
      setSelectedRoles(updatedSelectedRoles);
    } catch (err) {
      console.error('Error refreshing users:', err);
      setError('Failed to refresh users. Please try again.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="mr-2" />
          User Management
        </h1>
        
        <button 
          onClick={refreshUsers}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 transition-colors"
          disabled={isLoadingUsers}
        >
          {isLoadingUsers ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </button>
      </div>
      
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search users by name, email or ID..."
          className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {/* User List */}
      <div className="bg-white shadow overflow-hidden rounded-md">
        {isLoadingUsers ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-8 text-slate-500">
            No users found matching your search criteria.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {filteredUsers.map((user) => (
              <li key={user.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <div className="font-medium text-slate-900">
                        {user.displayName || user.fullName || 'Unnamed User'}
                      </div>
                      {user.godMode && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">
                          God Mode
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                    <div className="text-xs text-slate-400 mt-1">ID: {user.id}</div>
                  </div>
                  
                  <button
                    onClick={() => toggleEditUser(user.id)}
                    className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100"
                  >
                    {editingUser === user.id ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Hide Roles
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Edit Roles
                      </>
                    )}
                  </button>
                </div>
                
                {/* Current roles display */}
                {user.roles && user.roles.length > 0 && editingUser !== user.id && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {user.roles.map(role => (
                      <span 
                        key={role} 
                        className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-full"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Role editing */}
                {editingUser === user.id && (
                  <div className="mt-4 border-t pt-4">
                    <div className="mb-3 flex justify-between items-center">
                      <h3 className="font-medium">Assign Roles</h3>
                      <div className="flex items-center">
                        {saveSuccess[user.id] && (
                          <span className="text-green-600 text-sm flex items-center mr-3">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Saved
                          </span>
                        )}
                        <button
                          onClick={() => saveUserRoles(user.id)}
                          disabled={isSaving[user.id]}
                          className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300"
                        >
                          {isSaving[user.id] ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                          ) : (
                            <Save className="w-4 h-4 mr-1" />
                          )}
                          Save Changes
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {availableRoles.map(role => (
                        <div 
                          key={role}
                          onClick={() => toggleRole(user.id, role)}
                          className={`
                            px-3 py-2 rounded-md cursor-pointer flex items-center justify-between
                            ${selectedRoles[user.id]?.includes(role) 
                              ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                              : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'}
                          `}
                        >
                          <span className="text-sm">{role}</span>
                          {selectedRoles[user.id]?.includes(role) ? (
                            <CheckCircle className="w-4 h-4 text-orange-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
