import apiClient from './apiClient';

interface LoginResponse {
  token: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  wallet?: {
    balance: number;
    currency?: string;
  };
}

export const loginRequest = async (email: string, password: string) => {
  const response = await apiClient.post<LoginResponse>('/api/auth/login', { email, password });
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await apiClient.get<User>('/api/users/me');
  return response.data;
};

export const fetchWallet = async () => {
  const response = await apiClient.get<{ balance: number; currency?: string }>('/api/users/me/wallet');
  return response.data;
};
