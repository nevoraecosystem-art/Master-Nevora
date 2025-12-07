import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authStore } from '../store/authStore';
import Loader from '../components/Loader';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, user } = authStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      const role = authStore.getState().user?.role;
      if (role === 'PRODUCER') navigate('/dashboard/producer');
      else if (role === 'AMBASSADOR') navigate('/dashboard/ambassador');
      else if (role === 'FOUNDER') navigate('/founder');
      else navigate('/my-tickets');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Não foi possível entrar');
    }
  };

  if (loading && !user) return <Loader />;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Entrar</h2>
        <p className="mt-1 text-sm text-slate-600">Acesse sua conta Nevora.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary"
            />
          </div>
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Ainda não tem conta?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-light">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
