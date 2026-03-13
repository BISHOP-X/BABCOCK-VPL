import { createContext } from 'react';
import type { AuthState, LoginCredentials, SignupData, UserRole } from '@/types';

export interface AuthContextValue extends AuthState {
  login: (creds: LoginCredentials) => Promise<UserRole>;
  signup: (data: SignupData) => Promise<UserRole>;
  logout: () => Promise<void> | void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
