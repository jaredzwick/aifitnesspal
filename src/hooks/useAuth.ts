import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { FitnessUser } from '../types';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setAuthState({
          user: null,
          session: null,
          loading: false,
          error: 'Failed to load authentication session. Please refresh the page.',
        });
        return;
      }

      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null,
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const signUp = async (email: string, password: string, userData: Partial<FitnessUser>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      return { data, error };
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      return { 
        data: null, 
        error: { message: 'An unexpected error occurred during sign up. Please try again.' } 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      return { 
        data: null, 
        error: { message: 'An unexpected error occurred during sign in. Please try again.' } 
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
      return { error: { message: 'An unexpected error occurred during sign out. Please try again.' } };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch (err) {
      console.error('Unexpected error during password reset:', err);
      return { 
        data: null, 
        error: { message: 'An unexpected error occurred during password reset. Please try again.' } 
      };
    }
  };

  return {
    ...authState,
    clearError,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
};