import { create } from 'zustand';
import { listEvents } from '../api/eventsApi';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  producerId?: string;
}

interface EventsState {
  events: EventItem[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
}

export const useEventsStore = create<EventsState>((set) => ({
  events: [],
  loading: false,
  error: null,
  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const data = await listEvents();
      set({ events: data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao carregar eventos';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  }
}));
