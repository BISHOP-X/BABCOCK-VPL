import React, { useState, useCallback, useEffect } from 'react';
import type { User, LoginCredentials, SignupData, UserRole } from '@/types';
import { AuthContext } from './authContextValue';

const DEMO_ONLY_AUTH = true;
const DEMO_USER_KEY = 'vpl_demo_user';

const DEMO_USERS: Record<'student' | 'lecturer', User> = {
  student: {
    id: '11111111-1111-1111-1111-111111111001',
    email: 'alex.chen@babcock.edu.ng',
    full_name: 'Alex Chen',
    role: 'student',
    matric_number: '20/001',
    level: '300',
    department: 'Computer Science',
    created_at: new Date().toISOString(),
  },
  lecturer: {
    id: '22222222-2222-2222-2222-222222222001',
    email: 'anderson@babcock.edu.ng',
    full_name: 'Prof. James Anderson',
    role: 'lecturer',
    staff_id: 'BU/CS/001',
    department: 'Computer Science',
    created_at: new Date().toISOString(),
  },
};

function persistDemoUser(user: User | null) {
  if (!DEMO_ONLY_AUTH || typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(DEMO_USER_KEY);
  }
}

function readPersistedDemoUser(): User | null {
  if (!DEMO_ONLY_AUTH || typeof window === 'undefined') return null;

  const raw = localStorage.getItem(DEMO_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem(DEMO_USER_KEY);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (DEMO_ONLY_AUTH) {
      setUser(readPersistedDemoUser());
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (creds: LoginCredentials): Promise<UserRole> => {
    if (DEMO_ONLY_AUTH) {
      const email = creds.email.trim().toLowerCase();
      const password = creds.password;

      if (email === DEMO_USERS.student.email && password === 'Test1234!') {
        setUser(DEMO_USERS.student);
        persistDemoUser(DEMO_USERS.student);
        return 'student';
      }

      if (email === DEMO_USERS.lecturer.email && password === 'Test1234!') {
        setUser(DEMO_USERS.lecturer);
        persistDemoUser(DEMO_USERS.lecturer);
        return 'lecturer';
      }

      throw new Error('Demo mode: use the provided demo credentials only.');
    }

    throw new Error('Non-demo auth is currently disabled.');
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<UserRole> => {
    if (DEMO_ONLY_AUTH) {
      throw new Error('Signup is disabled in demo mode. Use demo credentials on login.');
    }

    throw new Error('Non-demo signup is currently disabled.');
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    persistDemoUser(null);
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