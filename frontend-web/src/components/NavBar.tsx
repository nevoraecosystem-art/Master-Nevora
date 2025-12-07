import { Link, useNavigate } from 'react-router-dom';
import { authStore } from '../store/authStore';
import { useEffect, useState } from 'react';

const roleDashboardMap: Record<string, string> = {
  PRODUCER: '/dashboard/producer',
  AMBASSADOR: '/dashboard/ambassador',
  CLIENT: '/my-tickets',
  FOUNDER: '/founder'
};

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = authStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all ${
        isScrolled ? 'bg-white/90 shadow' : 'bg-white'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold text-primary-dark">
          <span className="text-2xl">⚡</span>
          <span>Nevora Events</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-primary-light">
            Home
          </Link>
          <Link to="/#events" className="hover:text-primary-light">
            Eventos
          </Link>
          {user && (
            <Link to={roleDashboardMap[user.role]} className="hover:text-primary-light">
              Dashboard
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-full bg-primary text-white px-4 py-1 text-sm font-semibold shadow hover:bg-primary-light"
            >
              Sair
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-primary text-white px-4 py-1 text-sm font-semibold shadow hover:bg-primary-light"
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
