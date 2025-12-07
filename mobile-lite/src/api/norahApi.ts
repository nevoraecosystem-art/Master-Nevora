import apiClient from './apiClient';

export const norahApi = {
  sendMessage: (message: string) => apiClient.post('/api/norah/lite/chat', { message }),
};
