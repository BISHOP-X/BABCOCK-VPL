import React, { useState, useCallback, useEffect } from 'react';
import type { User, LoginCredentials, SignupData } from '@/types';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './authContextValue';

async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return data as User;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    // onAuthStateChange fires INITIAL_SESSION immediately on subscribe.
    // This is the ONLY way we detect the session. No getSession() needed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (ignore) return;

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (!ignore) {
            setUser(profile);
            setIsLoading(false);
          }
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Safety net: if onAuthStateChange never fires (broken env, etc),
    // unblock the UI after 3 seconds so login/signup forms are usable.
    const timeout = setTimeout(() => {
      if (!ignore) setIsLoading(false);
    }, 3000);

    return () => {
      ignore = true;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (creds: LoginCredentials) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: creds.email,
      password: creds.password,
    });
    if (error) throw new Error(error.message);
    // onAuthStateChange SIGNED_IN will set user
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    const composedFullName = [data.first_name, data.middle_name, data.last_name]
      .filter((part) => !!part && part.trim().length > 0)
      .join(' ')
      .trim();
    const fullName = data.full_name?.trim() || composedFullName;

    if (!fullName) {
      throw new Error('Full name is required');
    }

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: fullName,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          role: data.role,
          matric_number: data.matric_number,
          staff_id: data.staff_id,
          level: data.level,
          department: data.department ?? 'Computer Science',
        },
      },
    });
    if (error) throw new Error(error.message);
    // Wait for the DB trigger to create the profile row
    await new Promise((r) => setTimeout(r, 800));
    // onAuthStateChange SIGNED_IN will set user
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    // onAuthStateChange SIGNED_OUT will clear user
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};