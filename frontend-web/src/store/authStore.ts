import { create } from 'zustand';
import apiClient from '../api/apiClient';
import * as authApi from '../api/authApi';

export type UserRole = 'PRODUCER' | 'AMBASSADOR' | 'CLIENT' | 'FOUNDER';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: authApi.RegisterPayload) => Promise<void>;
  logout: () => void;
  setTokenFromStorage: () => Promise<void>;
}

export const authStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  loading: false,
  error: null,
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const data = await authApi.login({ email, password });
      const token = data.token as string;
      localStorage.setItem('nevora_token', token);
      set({ token });
      await get().setTokenFromStorage();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao autenticar';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  register: async (payload) => {
    await authApi.register(payload);
  },
  logout: () => {
    localStorage.removeItem('nevora_token');
    set({ token: null, user: null });
  },
  setTokenFromStorage: async () => {
    const storedToken = localStorage.getItem('nevora_token');
    if (!storedToken) return;
    set({ token: storedToken, loading: true });
    try {
      const { data } = await apiClient.get('/api/users/me');
      set({ user: data, token: storedToken });
    } catch (error) {
      localStorage.removeItem('nevora_token');
      set({ token: null, user: null });
    } finally {
      set({ loading: false });
    }
  }
}));
