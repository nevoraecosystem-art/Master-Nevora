import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authStore } from '../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = authStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'PRODUCER' | 'AMBASSADOR' | 'CLIENT' | 'FOUNDER'>('CLIENT');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && (['PRODUCER', 'AMBASSADOR', 'CLIENT', 'FOUNDER'] as const).includes(roleParam as any)) {
      setRole(roleParam as any);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ name, email, password, role });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Criar conta</h2>
        <p className="mt-1 text-sm text-slate-600">Bem-vindo(a) à Nevora Ecosystem.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold text-slate-700">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary"
            />
          </div>
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
          <div>
            <label className="text-sm font-semibold text-slate-700">Tipo de conta</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary"
            >
              <option value="PRODUCER">Produtor</option>
              <option value="AMBASSADOR">Embaixador</option>
              <option value="CLIENT">Cliente</option>
              <option value="FOUNDER">Founder</option>
            </select>
          </div>
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Conta criada! Redirecionando...</div>}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
          >
            Registrar
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-light">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
