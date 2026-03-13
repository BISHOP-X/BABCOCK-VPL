import React, { useState, useCallback, useEffect } from 'react';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import type { User, LoginCredentials, SignupData, UserRole } from '@/types';
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

async function fetchProfileWithRetry(
  userId: string,
  retries = 8,
  delayMs = 250,
): Promise<User | null> {
  for (let index = 0; index < retries; index += 1) {
    const profile = await fetchProfile(userId);
    if (profile) return profile;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return null;
}

function mapAuthUserToProfile(authUser: SupabaseAuthUser): User {
  const meta = authUser.user_metadata ?? {};
  const role = meta.role === 'lecturer' ? 'lecturer' : 'student';
  const inferredName = authUser.email?.split('@')[0] ?? 'User';

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    full_name: String(meta.full_name ?? inferredName),
    role,
    matric_number: meta.matric_number ? String(meta.matric_number) : undefined,
    staff_id: meta.staff_id ? String(meta.staff_id) : undefined,
    level: meta.level,
    department: String(meta.department ?? 'Computer Science'),
    avatar_url: meta.avatar_url ? String(meta.avatar_url) : undefined,
    created_at: authUser.created_at ?? new Date().toISOString(),
  };
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutHandle!);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const resolveAndSetUser = useCallback(async (authUser: SupabaseAuthUser | null) => {
    if (!authUser) {
      setUser(null);
      return null;
    }

    const profile = await fetchProfileWithRetry(authUser.id);
    const resolved = profile ?? mapAuthUserToProfile(authUser);
    setUser(resolved);
    return resolved;
  }, []);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const { data } = await withTimeout(
          supabase.auth.getSession(),
          7000,
          'Authentication check timed out. Please refresh and try again.',
        );

        if (!mounted) return;
        await resolveAndSetUser(data.session?.user ?? null);
      } catch {
        if (!mounted) return;
        setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      await resolveAndSetUser(session?.user ?? null);
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [resolveAndSetUser]);

  const login = useCallback(async (creds: LoginCredentials): Promise<UserRole> => {
    const { data, error } = await withTimeout(
      supabase.auth.signInWithPassword({
        email: creds.email,
        password: creds.password,
      }),
      15000,
      'Sign in timed out. Please check your connection and try again.',
    );

    if (error || !data.user) {
      throw new Error(error?.message ?? 'Unable to sign in.');
    }

    const resolvedUser = await resolveAndSetUser(data.user);
    return (resolvedUser?.role ?? 'student') as UserRole;
  }, [resolveAndSetUser]);

  const signup = useCallback(async (data: SignupData): Promise<UserRole> => {
    const composedFullName = [data.first_name, data.middle_name, data.last_name]
      .filter((part) => !!part && part.trim().length > 0)
      .join(' ')
      .trim();
    const fullName = data.full_name?.trim() || composedFullName;

    if (!fullName) {
      throw new Error('Full name is required');
    }

    const { data: authData, error } = await withTimeout(
      supabase.auth.signUp({
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
      }),
      20000,
      'Account creation timed out. Please try again.',
    );

    if (error || !authData.user) {
      throw new Error(error?.message ?? 'Unable to create account.');
    }

    if (!authData.session?.user) {
      throw new Error('Account created. Please verify your email before signing in.');
    }

    const resolvedUser = await resolveAndSetUser(authData.user);
    return (resolvedUser?.role ?? data.role ?? 'student') as UserRole;
  }, [resolveAndSetUser]);

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