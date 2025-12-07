import { useEffect, useMemo } from 'react';
import { useEventsStore } from '../store/eventsStore';
import Loader from '../components/Loader';
import DashboardCard from '../components/DashboardCard';
import { authStore } from '../store/authStore';

const AmbassadorDashboard = () => {
  const { events, loading, fetchEvents } = useEventsStore();
  const { user } = authStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const estimatedCommission = useMemo(() => {
    return events.length * 50; // placeholder
  }, [events]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Embaixador</p>
        <h1 className="text-3xl font-bold text-slate-900">Eventos para divulgar</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="Comissão estimada"
          value={`R$ ${estimatedCommission.toFixed(2)}`}
          description="Baseado nas oportunidades disponíveis"
        />
        <DashboardCard title="Eventos ativos" value={events.length} />
        <DashboardCard title="Carteira NEV" value="Em breve" description="Saldo consolidado" />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-primary">{event.location}</div>
                    <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
                    <p className="text-sm text-slate-600">{event.description}</p>
                  </div>
                  <div className="text-sm text-slate-700">
                    <div>
                      Link de embaixador:
                      <span className="ml-2 font-semibold text-primary">
                        {`${window.location.origin}/events/${event.id}?ambassadorId=${user?.id}`}
                      </span>
                    </div>
                    <div className="mt-1">Comissão estimada: R$ {(event.price * 0.1).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center text-sm text-slate-600">Nenhum evento disponível ainda.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbassadorDashboard;
