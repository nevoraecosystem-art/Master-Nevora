import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { buyTicket, getEvent } from '../api/eventsApi';
import Loader from '../components/Loader';
import { authStore } from '../store/authStore';
import { EventItem } from '../store/eventsStore';

const EventPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user, token } = authStore();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchEvent = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getEvent(id);
      setEvent(data);
    } catch (error) {
      setMessage('Evento não encontrado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleBuy = async () => {
    if (!id) return;
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const ambassadorId = user?.role === 'AMBASSADOR' ? user.id : searchParams.get('ambassadorId') || undefined;
      await buyTicket(id, { ambassadorId: ambassadorId || undefined });
      setMessage('Ingresso comprado com sucesso!');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao comprar ingresso');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !event) return <Loader />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {event ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{event.location}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{event.title}</h1>
          <p className="mt-2 text-slate-700">{event.description}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
            <span>
              {new Date(event.startDate).toLocaleDateString('pt-BR')} - {new Date(event.endDate).toLocaleDateString('pt-BR')}
            </span>
            <span className="font-semibold text-primary-dark">R$ {event.price.toFixed(2)}</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {token ? (
              <button
                onClick={handleBuy}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
              >
                {loading ? 'Processando...' : 'Comprar ingresso'}
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
              >
                Entre para comprar
              </Link>
            )}
            {user?.role === 'AMBASSADOR' && (
              <span className="text-sm text-slate-600">
                Seu link: {`${window.location.href}?ambassadorId=${user.id}`}
              </span>
            )}
          </div>
          {message && <div className="mt-3 text-sm text-slate-700">{message}</div>}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500">Evento não encontrado.</div>
      )}
    </div>
  );
};

export default EventPage;
// implementado na Etapa 2
