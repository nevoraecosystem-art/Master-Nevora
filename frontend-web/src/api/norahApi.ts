import apiClient from './apiClient';

export const getStatus = async () => {
  const { data } = await apiClient.get('/api/norah/status');
  return data;
};

export const liteChat = async (prompt: string) => {
  const { data } = await apiClient.post('/api/norah/lite/chat', { prompt });
  return data;
};
