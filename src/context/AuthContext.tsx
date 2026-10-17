import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/models';
import { StorageService } from '../lib/storage';

interface AuthContextType {
  currentUser: UserProfile;
  availableProfiles: UserProfile[];
  isAuthenticated: boolean;
  loginAs: (profileId: string) => void;
  loginWithRole: (role: UserRole) => void;
  logout: () => void;
  canAccess: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => StorageService.getCurrentUser());
  const [availableProfiles] = useState<UserProfile[]>(() => StorageService.getAvailableProfiles());

  useEffect(() => {
    StorageService.setCurrentUser(currentUser);
  }, [currentUser]);

  const loginAs = (profileId: string) => {
    const profile = availableProfiles.find((p) => p.id === profileId);
    if (profile) {
      setCurrentUser(profile);
      StorageService.logAction('USER_LOGIN', 'UserProfile', profile.id, `User signed in as ${profile.fullName} (${profile.role})`);
    }
  };

  const loginWithRole = (role: UserRole) => {
    const profile = availableProfiles.find((p) => p.role === role) || {
      id: `user-${role}`,
      fullName: `${role.toUpperCase().replace('_', ' ')} Staff`,
      email: `${role}@thekkanath.com`,
      role,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(profile);
  };

  const logout = () => {
    // Revert to demo super_admin or visitor
    const fallback = availableProfiles[0];
    setCurrentUser(fallback);
  };

  const canAccess = (allowedRoles: UserRole[]): boolean => {
    if (currentUser.role === 'super_admin') return true;
    return allowedRoles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        availableProfiles,
        isAuthenticated: true,
        loginAs,
        loginWithRole,
        logout,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
