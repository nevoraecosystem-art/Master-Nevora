import apiClient from './apiClient';

export const sendFounderCommand = async (command: string) => {
  const response = await apiClient.post<{ result: string }>(
    '/api/founder/command',
    {
      command,
      token: 'SOU FUNDADOR 0001rui0002alice0003pedro0004arthur0001rui0002alice0003pedro0004arthur',
    }
  );
  return response.data;
};
