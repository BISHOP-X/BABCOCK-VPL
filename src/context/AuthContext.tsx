import React, { useState, useCallback, useEffect } from 'react';
import type { User, AuthState, LoginCredentials, SignupData } from '@/types';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './authContextValue';

// ---------- Helper: fetch profile from Supabase ----------
async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return data as User;
}

// ---------- Provider ----------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Listen to Supabase auth state changes (single source of truth)
  useEffect(() => {
    // 1. Check existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: profile,
          isAuthenticated: !!profile,
          isLoading: false,
        });
      } else {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    // 2. Subscribe to future auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: profile,
            isAuthenticated: !!profile,
            isLoading: false,
          });
        } else if (event === 'SIGNED_OUT') {
          setState({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (creds: LoginCredentials) => {
    setState((s) => ({ ...s, isLoading: true }));
    const { error } = await supabase.auth.signInWithPassword({
      email: creds.email,
      password: creds.password,
    });
    if (error) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error(error.message);
    }
    // onAuthStateChange will handle setting the user state
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setState((s) => ({ ...s, isLoading: true }));
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: data.role,
          matric_number: data.matric_number,
          staff_id: data.staff_id,
          level: data.level,
          department: data.department ?? 'Computer Science',
        },
      },
    });
    if (error) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error(error.message);
    }
    // onAuthStateChange will handle setting the user state
    // Small wait for the DB trigger to create the profile row
    await new Promise((r) => setTimeout(r, 600));
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
