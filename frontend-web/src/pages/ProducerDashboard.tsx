import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';
import { createEvent, getAnalytics, listEvents } from '../api/eventsApi';
import { authStore } from '../store/authStore';
import { EventItem } from '../store/eventsStore';

const ProducerDashboard = () => {
  const { user } = authStore();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    price: 0
  });
  const [analytics, setAnalytics] = useState<Record<string, any>>({});
  const [message, setMessage] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await listEvents();
      const mine = user ? data.filter((evt: EventItem) => evt.producerId === user.id) : data;
      setEvents(mine);
    } catch (error) {
      setMessage('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await createEvent({
        title: form.title,
        description: form.description,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
        price: Number(form.price)
      });
      setForm({ title: '', description: '', location: '', startDate: '', endDate: '', price: 0 });
      setMessage('Evento criado com sucesso!');
      fetchEvents();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalytics = async (eventId: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await getAnalytics(eventId);
      setAnalytics((prev) => ({ ...prev, [eventId]: data }));
    } catch (error) {
      setMessage('Erro ao carregar analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Produtor</p>
          <h1 className="text-3xl font-bold text-slate-900">Meus eventos</h1>
        </div>
        <DashboardCard title="Carteira" value={user?.id ? 'NEV pronta' : '---'} description="Saldo na carteira NEV" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Eventos publicados</h2>
            <button
              onClick={fetchEvents}
              className="text-sm font-semibold text-primary hover:text-primary-light"
            >
              Atualizar
            </button>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="mt-4 space-y-3">
              {events.map((event) => (
                <div key={event.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
                      <p className="text-sm text-slate-600">{event.description}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {event.location} • {new Date(event.startDate).toLocaleDateString('pt-BR')}
                      </p>
                      <Link to={`/events/${event.id}`} className="mt-2 inline-block text-sm font-semibold text-primary">
                        Página pública
                      </Link>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">R$ {event.price.toFixed(2)}</div>
                      <button
                        onClick={() => handleAnalytics(event.id)}
                        className="mt-2 text-sm font-semibold text-slate-700 hover:text-primary"
                      >
                        Ver analytics
                      </button>
                    </div>
                  </div>
                  {analytics[event.id] && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                      <div>Vendas: {analytics[event.id].sales ?? 'N/A'}</div>
                      <div>Receita: {analytics[event.id].revenue ?? 'N/A'}</div>
                      <div>Visitantes: {analytics[event.id].visitors ?? 'N/A'}</div>
                    </div>
                  )}
                </div>
              ))}
              {events.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500">
                  Nenhum evento ainda. Crie o primeiro!
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Criar novo evento</h2>
          <form className="mt-4 space-y-3" onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Título"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary"
            />
            <textarea
              placeholder="Descrição"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary"
            />
            <input
              type="text"
              placeholder="Local"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500">Início</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Fim</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500">Preço base</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
            >
              {loading ? 'Salvando...' : 'Criar evento'}
            </button>
            {message && <div className="text-center text-sm text-slate-600">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;
// implementado na Etapa 2
