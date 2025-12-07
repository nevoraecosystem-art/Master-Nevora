import apiClient from './apiClient';

export interface EventPayload {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
}

export const listEvents = async () => {
  const { data } = await apiClient.get('/api/events');
  return data;
};

export const getEvent = async (id: string) => {
  const { data } = await apiClient.get(`/api/events/${id}`);
  return data;
};

export const createEvent = async (payload: EventPayload) => {
  const { data } = await apiClient.post('/api/events', payload);
  return data;
};

export const buyTicket = async (eventId: string, payload: { ambassadorId?: string }) => {
  const { data } = await apiClient.post(`/api/events/${eventId}/tickets`, payload);
  return data;
};

export const getAnalytics = async (eventId: string) => {
  const { data } = await apiClient.get(`/api/events/${eventId}/analytics`);
  return data;
};
