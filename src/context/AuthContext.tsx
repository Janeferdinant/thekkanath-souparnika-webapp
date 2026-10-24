import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/models';
import { supabase } from '../lib/supabase';
import { StorageService } from '../lib/storage';

interface AuthContextType {
  currentUser: UserProfile | null;
  availableProfiles: UserProfile[];
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  canAccess: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile from Supabase user ID
  const fetchProfile = async (userId: string, email?: string): Promise<UserProfile | null> => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching profile from Supabase:', error.message);
      }

      if (data) {
        return {
          id: data.id,
          fullName: data.full_name,
          email: data.email,
          phone: data.phone,
          role: data.role as UserRole,
          createdAt: data.created_at,
        };
      }

      // Fallback profile if user exists in auth but profile record is pending
      if (email) {
        return {
          id: userId,
          fullName: email.split('@')[0],
          email: email,
          role: 'staff',
          createdAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.error('Exception fetching user profile:', err);
    }
    return null;
  };

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user.id, session.user.email);
          if (mounted && profile) {
            setCurrentUser(profile);
            StorageService.setCurrentUser(profile);
          }
        }
      } catch (err) {
        console.error('Error checking active Supabase session:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    // Listen to real-time auth state changes
    const { data: authListener } = supabase?.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id, session.user.email);
          if (profile) {
            setCurrentUser(profile);
            StorageService.setCurrentUser(profile);
          }
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      }
    ) ?? { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch all staff profiles for admin lists
  useEffect(() => {
    if (!currentUser || !supabase) return;

    let active = true;
    async function loadProfiles() {
      try {
        const { data, error } = await supabase!.from('profiles').select('*');
        if (error) {
          console.warn('Could not load profiles list:', error.message);
          return;
        }
        if (data && data.length > 0 && active) {
          setAvailableProfiles(
            data.map((p) => ({
              id: p.id,
              fullName: p.full_name,
              email: p.email,
              phone: p.phone,
              role: p.role as UserRole,
              createdAt: p.created_at,
            }))
          );
        }
      } catch (err) {
        console.warn('Could not load profiles list:', err);
      }
    }

    loadProfiles();
    return () => {
      active = false;
    };
  }, [currentUser]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Database service is currently unconfigured.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id, data.user.email);
        if (profile) {
          setCurrentUser(profile);
          StorageService.setCurrentUser(profile);
          StorageService.logAction(
            'USER_LOGIN',
            'UserProfile',
            profile.id,
            `Staff member ${profile.fullName} signed in as ${profile.role}`
          );
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during login.' };
    }
  };

  const logout = async (): Promise<void> => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  const canAccess = (allowedRoles: UserRole[]): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return allowedRoles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        availableProfiles,
        isAuthenticated: Boolean(currentUser),
        isLoading,
        signIn,
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
