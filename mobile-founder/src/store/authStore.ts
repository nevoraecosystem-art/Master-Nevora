import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginRequest, fetchCurrentUser, User } from '../api/authApi';

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  loading: false,
  error: null,
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { token } = await loginRequest(email, password);
      await AsyncStorage.setItem('norah_token', token);
      set({ token });
      const user = await fetchCurrentUser();
      if (user.role !== 'FOUNDER') {
        throw new Error('App exclusivo do Founder');
      }
      set({ user, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao autenticar';
      await AsyncStorage.removeItem('norah_token');
      set({ token: null, user: null, error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  restoreSession: async () => {
    const existing = await AsyncStorage.getItem('norah_token');
    if (!existing) return;
    set({ loading: true });
    try {
      set({ token: existing });
      const user = await fetchCurrentUser();
      if (user.role !== 'FOUNDER') {
        throw new Error('App exclusivo do Founder');
      }
      set({ user, error: null });
    } catch (error) {
      await AsyncStorage.removeItem('norah_token');
      set({ token: null, user: null, error: null });
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    await AsyncStorage.removeItem('norah_token');
    set({ token: null, user: null, error: null });
  },
}));

export default useAuthStore;
