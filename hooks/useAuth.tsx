// hooks/useAuth.tsx
'use client';

import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, AuthState, SignUpData, SignInData } from '@/types/user';
import { useRouter } from 'next/navigation';

interface AuthContextType extends AuthState {
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Load user from Supabase session on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const user: User = {
            id: session.user.id,
            name: profile?.name || session.user.user_metadata?.name || 'User',
            email: session.user.email || undefined,
            phone: session.user.phone || undefined,
            role: profile?.role || 'user',
            avatar: profile?.avatar_url,
            savedExperiences: [],
            createdAt: session.user.created_at,
            updatedAt: session.user.updated_at || session.user.created_at,
            isVerified: session.user.email_confirmed_at ? true : false,
          };
          
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const user: User = {
            id: session.user.id,
            name: profile?.name || session.user.user_metadata?.name || 'User',
            email: session.user.email || undefined,
            phone: session.user.phone || undefined,
            role: profile?.role || 'user',
            avatar: profile?.avatar_url,
            savedExperiences: [],
            createdAt: session.user.created_at,
            updatedAt: session.user.updated_at || session.user.created_at,
            isVerified: session.user.email_confirmed_at ? true : false,
          };
          
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign Up with Email/Phone
  const signUp = useCallback(async (data: SignUpData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let authData;
      
      if (data.email) {
        // Email signup
        authData = await supabase.auth.signUp({
          email: data.email,
          password: data.password!,
          options: {
            data: {
              name: data.name,
            },
          },
        });
      } else if (data.phone) {
        // Phone signup - Supabase requires password for phone signup too
        const tempPassword = data.password || 'Temp123!@#';
        authData = await supabase.auth.signUp({
          phone: data.phone,
          password: tempPassword,
          options: {
            data: {
              name: data.name,
            },
          },
        });
      } else {
        throw new Error('Email or phone required');
      }

      if (authData.error) throw authData.error;

      // Profile is auto-created by the database trigger
      const user: User = {
        id: authData.data.user!.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'user',
        savedExperiences: [],
        createdAt: authData.data.user!.created_at,
        updatedAt: authData.data.user!.created_at,
        isVerified: false,
      };

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      router.refresh();
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to sign up. Please try again.',
      }));
    }
  }, [router]);

  // Sign In with Email/Phone
  const signIn = useCallback(async (data: SignInData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let authData;
      
      // Check if identifier is email or phone
      const isEmail = data.identifier.includes('@');
      
      if (isEmail) {
        // Email sign in
        authData = await supabase.auth.signInWithPassword({
          email: data.identifier,
          password: data.password!,
        });
      } else {
        // Phone sign in with OTP
        if (data.otp) {
          // Verify OTP
          const result = await supabase.auth.verifyOtp({
            phone: data.identifier,
            token: data.otp,
            type: 'sms',
          });
          if (result.error) throw result.error;
          authData = result;
        } else {
          // Send OTP
          const { error } = await supabase.auth.signInWithOtp({
            phone: data.identifier,
          });
          if (error) throw error;
          
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }
      }

      if (authData?.error) throw authData.error;

      if (authData?.data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.data.user.id)
          .single();

        const user: User = {
          id: authData.data.user.id,
          name: profile?.name || authData.data.user.user_metadata?.name || 'User',
          email: authData.data.user.email || undefined,
          phone: authData.data.user.phone || undefined,
          role: profile?.role || 'user',
          avatar: profile?.avatar_url,
          savedExperiences: [],
          createdAt: authData.data.user.created_at,
          updatedAt: authData.data.user.updated_at || authData.data.user.created_at,
          isVerified: authData.data.user.email_confirmed_at ? true : false,
        };

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        router.refresh();
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to sign in. Please try again.',
      }));
    }
  }, [router]);

  // Sign Out
  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await supabase.auth.signOut();
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      router.refresh();
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [router]);

  // Send OTP
  const sendOTP = useCallback(async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw error;
    }
  }, []);

  // Verify OTP - returns void to match AuthContextType
  const verifyOTP = useCallback(async (phone: string, otp: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });
      if (error) throw error;
      
      // Update user state after verification
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: User = {
          id: data.user.id,
          name: profile?.name || data.user.user_metadata?.name || 'User',
          email: data.user.email || undefined,
          phone: data.user.phone || undefined,
          role: profile?.role || 'user',
          avatar: profile?.avatar_url,
          savedExperiences: [],
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at || data.user.created_at,
          isVerified: true,
        };

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        router.refresh();
      }
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      throw error;
    }
  }, [router]);

  // Update User Profile
  const updateUser = useCallback(async (data: Partial<User>) => {
    if (!state.user) return;
    
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          avatar_url: data.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.user.id);

      if (error) throw error;

      // Update user metadata in auth
      if (data.name) {
        await supabase.auth.updateUser({
          data: { name: data.name },
        });
      }

      setState(prev => ({
        ...prev,
        user: { ...prev.user!, ...data },
      }));
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }, [state.user]);

  const value = {
    ...state,
    signUp,
    signIn,
    signOut,
    sendOTP,
    verifyOTP,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}