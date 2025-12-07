import { FormEvent, useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';
import apiClient from '../api/apiClient';
import { getStatus } from '../api/norahApi';

const FOUNDER_TOKEN =
  'SOU FUNDADOR 0001rui0002alice0003pedro0004arthur0001rui0002alice0003pedro0004arthur';

const FounderPanel = () => {
  const [metrics, setMetrics] = useState({ users: 0, events: 0, revenue: 0, balance: 'NEV' });
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [norahStatus, setNorahStatus] = useState<string>('');

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const [{ data: adminData }, statusData] = await Promise.all([
        apiClient.get('/api/admin/overview').catch(() => ({ data: metrics })),
        getStatus().catch(() => ({ status: 'offline' }))
      ]);
      setMetrics({
        users: adminData.users ?? metrics.users,
        events: adminData.events ?? metrics.events,
        revenue: adminData.revenue ?? metrics.revenue,
        balance: adminData.balance ?? metrics.balance
      });
      setNorahStatus((statusData as any).status || 'Indefinido');
    } catch (error) {
      setNorahStatus('Indisponível');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleCommand = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await apiClient.post('/api/founder/command', {
        command,
        token: FOUNDER_TOKEN // Em produção, mover para configuração segura.
      });
      setResponse(data?.result || 'Resposta registrada');
    } catch (error: any) {
      setResponse(error.response?.data?.message || 'Erro ao enviar comando');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Founder</p>
        <h1 className="text-3xl font-bold text-slate-900">Painel estratégico</h1>
        <p className="text-sm text-slate-600">Visão macro do ecossistema Nevora e comandos diretos para Norah.</p>
      </div>

      {loading && <Loader />}

      <div className="grid gap-4 md:grid-cols-4">
        <DashboardCard title="Usuários" value={metrics.users} />
        <DashboardCard title="Eventos" value={metrics.events} />
        <DashboardCard title="Receita estimada" value={`R$ ${metrics.revenue}`} />
        <DashboardCard title="Saldo global" value={metrics.balance} description="Wallet NEV consolidada" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Status Norah</h2>
          <p className="text-sm text-slate-600">{norahStatus || 'Aguardando status...'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Enviar comando</h2>
          <form className="mt-3 space-y-3" onSubmit={handleCommand}>
            <input
              type="text"
              placeholder="Ex.: ANALISAR MERCADO"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
            >
              Enviar para Norah
            </button>
          </form>
          {response && <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{response}</div>}
        </div>
      </div>
    </div>
  );
};

export default FounderPanel;
