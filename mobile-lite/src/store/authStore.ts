import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi, LoginPayload, RegisterPayload } from '../api/authApi';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  initializing: boolean;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const persistToken = useCallback(async (value: string | null) => {
    if (value) {
      await AsyncStorage.setItem('token', value);
    } else {
      await AsyncStorage.removeItem('token');
    }
  }, []);

  const fetchProfile = useCallback(async (tokenOverride?: string) => {
    const response = await authApi.getMe(tokenOverride);
    setUser(response.data);
  }, []);

  const restoreSession = useCallback(async () => {
    setInitializing(true);
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        await fetchProfile(storedToken);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to restore session', error);
    } finally {
      setInitializing(false);
    }
  }, [fetchProfile]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      try {
        const response = await authApi.login(payload);
        const receivedToken = response.data?.token as string;
        setToken(receivedToken);
        await persistToken(receivedToken);
        await fetchProfile(receivedToken);
      } finally {
        setLoading(false);
      }
    },
    [fetchProfile, persistToken]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      try {
        await authApi.register({ ...payload, role: payload.role || 'CLIENT' });
        await login({ email: payload.email, password: payload.password });
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      setUser(null);
      setToken(null);
      await persistToken(null);
    } finally {
      setLoading(false);
    }
  }, [persistToken]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <AuthContext.Provider
      value={{ token, user, loading, initializing, login, register, restoreSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
