import { create } from 'zustand';
import { fetchNorahStatus, NorahStatus } from '../api/norahApi';
import { fetchEvents } from '../api/eventsApi';
import { fetchWallet } from '../api/authApi';

interface FounderState {
  norahStatus: NorahStatus | null;
  eventsCount: number;
  walletBalance: string;
  loading: boolean;
  error: string | null;
  loadDashboard: () => Promise<void>;
}

const formatWallet = (balance?: number, currency?: string) => {
  if (balance === undefined) return '—';
  return `${currency || 'NEV'} ${balance.toFixed(2)}`;
};

const useFounderStore = create<FounderState>((set) => ({
  norahStatus: null,
  eventsCount: 0,
  walletBalance: '—',
  loading: false,
  error: null,
  loadDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const [status, events, wallet] = await Promise.all([
        fetchNorahStatus(),
        fetchEvents(),
        fetchWallet(),
      ]);
      set({
        norahStatus: status,
        eventsCount: events.length,
        walletBalance: formatWallet(wallet.balance, wallet.currency),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar dados';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useFounderStore;
