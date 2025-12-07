import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import { useEventsStore } from '../store/eventsStore';

const Home = () => {
  const { events, loading, fetchEvents } = useEventsStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      navigate(`/register?role=${roleParam}`);
    }
  }, [navigate, searchParams]);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="grid gap-8 py-12 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Plataforma inteligente</p>
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            Nevora Events com IA Norah
          </h1>
          <p className="text-lg text-slate-600">
            Produtores criam e vendem. Embaixadores ganham comissões. Clientes compram com fluidez.
            Uma única plataforma, impulsionada pela Norah.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register?role=PRODUCER"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-light"
            >
              Sou Produtor
            </Link>
            <Link
              to="/register?role=AMBASSADOR"
              className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              Sou Embaixador
            </Link>
            <a
              href="#events"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-primary hover:text-primary"
            >
              Quero comprar ingressos
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute -right-6 bottom-0 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-slate-900">IA Norah assistindo seu evento</h3>
            <p className="mt-2 text-sm text-slate-600">
              Insights em tempo real, suporte ao cliente e otimização de vendas. Tudo dentro da jornada.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• Analytics inteligentes e previsões</li>
              <li>• Chat Norah Lite integrado</li>
              <li>• Gestão de ingressos e carteira NEV</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="events" className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Eventos</p>
            <h2 className="text-2xl font-bold text-slate-900">Experiências em destaque</h2>
          </div>
          <Link
            to="/login"
            className="text-sm font-semibold text-primary hover:text-primary-light"
          >
            Acesse para criar ou comprar
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {events.length === 0 && (
              <div className="col-span-full rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500">
                Nenhum evento encontrado no momento.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
// implementado na Etapa 2
