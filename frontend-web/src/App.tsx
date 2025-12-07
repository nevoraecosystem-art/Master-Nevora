import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProducerDashboard from './pages/ProducerDashboard';
import AmbassadorDashboard from './pages/AmbassadorDashboard';
import EventPage from './pages/EventPage';
import MyTickets from './pages/MyTickets';
import FounderPanel from './pages/FounderPanel';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { authStore } from './store/authStore';
import Loader from './components/Loader';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, loading } = authStore();

  if (loading) return <Loader />;
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const setTokenFromStorage = authStore((state) => state.setTokenFromStorage);

  useEffect(() => {
    setTokenFromStorage();
  }, [setTokenFromStorage]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/producer"
            element={
              <ProtectedRoute>
                <ProducerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ambassador"
            element={
              <ProtectedRoute>
                <AmbassadorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/events/:id" element={<EventPage />} />
          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute>
                <MyTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/founder"
            element={
              <ProtectedRoute>
                <FounderPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
