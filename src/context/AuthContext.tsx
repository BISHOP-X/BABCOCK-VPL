import React, { useState, useCallback, useEffect } from 'react';
import type { User, AuthState, LoginCredentials, SignupData } from '@/types';
import { loginUser, signupUser } from '@/services/mockApi';
import { AuthContext } from './authContextValue';

// ---------- Storage helpers ----------
const STORAGE_KEY = 'babcock_vpl_user';

function persistUser(user: User) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearPersistedUser() {
  localStorage.removeItem(STORAGE_KEY);
}

function loadPersistedUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

// ---------- Provider ----------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const saved = loadPersistedUser();
    setState({
      user: saved,
      isAuthenticated: !!saved,
      isLoading: false,
    });
  }, []);

  const login = useCallback(async (creds: LoginCredentials) => {
    setState((s) => ({ ...s, isLoading: true }));
    const user = await loginUser(creds.email, creds.password, creds.role);
    if (!user) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error('Invalid email or password');
    }
    persistUser(user);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setState((s) => ({ ...s, isLoading: true }));
    const user = await signupUser(data.email, data.password, data.full_name, data.role);
    persistUser(user);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    clearPersistedUser();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
