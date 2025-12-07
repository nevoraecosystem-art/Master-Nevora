import apiClient from './apiClient';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post('/api/auth/register', { ...payload, role: payload.role || 'CLIENT' }),
  login: (payload: LoginPayload) => apiClient.post('/api/auth/login', payload),
  getMe: (tokenOverride?: string) =>
    apiClient.get('/api/users/me', {
      headers: tokenOverride
        ? {
            Authorization: `Bearer ${tokenOverride}`,
          }
        : undefined,
    }),
  getWallet: () => apiClient.get('/api/users/me/wallet'),
};
