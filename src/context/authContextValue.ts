import { createContext } from 'react';
import type { AuthState, LoginCredentials, SignupData } from '@/types';

export interface AuthContextValue extends AuthState {
  login: (creds: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void> | void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
