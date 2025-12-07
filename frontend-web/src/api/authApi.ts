import apiClient from './apiClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'PRODUCER' | 'AMBASSADOR' | 'CLIENT' | 'FOUNDER';
}

export const login = async (payload: LoginPayload) => {
  const { data } = await apiClient.post('/api/auth/login', payload);
  return data;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await apiClient.post('/api/auth/register', payload);
  return data;
};
