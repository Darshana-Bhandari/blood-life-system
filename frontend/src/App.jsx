import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminBloodStock from './pages/admin/BloodStock';
import AdminDonations from './pages/admin/Donations';

// Donor Pages
import DonorDashboard from './pages/donor/Dashboard';
import DonorProfile from './pages/donor/Profile';
import DonorDonations from './pages/donor/Donations';

// Receiver Pages
import ReceiverDashboard from './pages/receiver/Dashboard';
import ReceiverProfile from './pages/receiver/Profile';
import ReceiverSearch from './pages/receiver/SearchDonors';
import ReceiverRequests from './pages/receiver/Requests';

// Home redirect
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/blood-stock" element={<ProtectedRoute role="admin"><AdminBloodStock /></ProtectedRoute>} />
          <Route path="/admin/donations" element={<ProtectedRoute role="admin"><AdminDonations /></ProtectedRoute>} />

          {/* Donor */}
          <Route path="/donor" element={<ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>} />
          <Route path="/donor/profile" element={<ProtectedRoute role="donor"><DonorProfile /></ProtectedRoute>} />
          <Route path="/donor/donations" element={<ProtectedRoute role="donor"><DonorDonations /></ProtectedRoute>} />

          {/* Receiver */}
          <Route path="/receiver" element={<ProtectedRoute role="receiver"><ReceiverDashboard /></ProtectedRoute>} />
          <Route path="/receiver/profile" element={<ProtectedRoute role="receiver"><ReceiverProfile /></ProtectedRoute>} />
          <Route path="/receiver/search" element={<ProtectedRoute role="receiver"><ReceiverSearch /></ProtectedRoute>} />
          <Route path="/receiver/requests" element={<ProtectedRoute role="receiver"><ReceiverRequests /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '4rem' }}>
              <div style={{ fontSize: '4rem' }}>🩸</div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>404 – Page Not Found</h1>
              <p style={{ color: '#6b7280' }}>The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
