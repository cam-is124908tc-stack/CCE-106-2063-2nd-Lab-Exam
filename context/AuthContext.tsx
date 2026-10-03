import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/api';

export type User = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  authLoading: boolean;
  login: (accessToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = useCallback(async (accessToken: string, userData: User) => {
    if (Platform.OS !== 'web' && await SecureStore.isAvailableAsync()) {
      await SecureStore.setItemAsync('accessToken', accessToken);
    }
    setToken(accessToken);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (Platform.OS !== 'web' && await SecureStore.isAvailableAsync()) {
        await SecureStore.deleteItemAsync('accessToken');
      }
    } catch {
      // Clear in-memory auth even if secure storage fails.
    } finally {
      setToken(null);
      setUser(null);
    }
  }, []);

  const restoreSession = useCallback(async () => {
    setAuthLoading(true);
    try {
      if (Platform.OS === 'web' || !(await SecureStore.isAvailableAsync())) return;
      const savedToken = await SecureStore.getItemAsync('accessToken');
      if (!savedToken) return;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      if (!response.ok) {
        await SecureStore.deleteItemAsync('accessToken');
        return;
      }
      const profile = await response.json();
      setToken(savedToken);
      setUser({
        ...profile,
        name: [profile.firstName, profile.lastName].filter(Boolean).join(' '),
      });
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  return (
    <AuthContext.Provider value={{ token, user, authLoading, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}
