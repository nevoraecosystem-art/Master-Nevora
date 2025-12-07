import apiClient from './apiClient';

export interface NorahStatus {
  status: string;
  uptime?: string;
  orchestratorStartedAt?: string;
  modules?: string[];
}

export const fetchNorahStatus = async () => {
  const response = await apiClient.get<NorahStatus>('/api/norah/status');
  return response.data;
};

export const sendNorahMessage = async (message: string) => {
  const response = await apiClient.post<{ reply: string }>('/api/norah/lite/chat', { message });
  return response.data;
};
