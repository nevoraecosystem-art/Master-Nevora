import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import apiClient from '../api/apiClient';

interface Ticket {
  id: string;
  event: {
    id: string;
    title: string;
    startDate: string;
  };
  pricePaid: number;
  purchasedAt: string;
}

const MyTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/api/users/me/tickets');
      setTickets(data);
    } catch (error) {
      setMessage('Não foi possível carregar seus ingressos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Meus ingressos</p>
        <h1 className="text-3xl font-bold text-slate-900">Histórico de compras</h1>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <Loader />
        ) : tickets.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="py-3">
                <div className="text-lg font-semibold text-slate-900">{ticket.event.title}</div>
                <div className="text-sm text-slate-600">
                  {new Date(ticket.event.startDate).toLocaleDateString('pt-BR')} • R$ {ticket.pricePaid.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500">
                  Comprado em {new Date(ticket.purchasedAt).toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-slate-600">Nenhum ingresso encontrado.</div>
        )}
        {message && <div className="mt-2 text-center text-sm text-slate-600">{message}</div>}
      </div>
    </div>
  );
};

export default MyTickets;
