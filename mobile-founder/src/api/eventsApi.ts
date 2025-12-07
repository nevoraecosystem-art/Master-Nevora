import apiClient from './apiClient';

export interface EventItem {
  id: string;
  name: string;
  createdAt: string;
}

export const fetchEvents = async () => {
  const response = await apiClient.get<EventItem[]>('/api/events');
  return response.data;
};

export const fetchEventAnalytics = async (eventId: string) => {
  const response = await apiClient.get(`/api/events/${eventId}/analytics`);
  return response.data;
};
