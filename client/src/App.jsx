import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PortalLayout from './components/PortalLayout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import VendorHome from './vendor/pages/Home';
import CompanyHome from './company/pages/Home';

// Route Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 600 }}>
          Loading session...
        </p>
      </div>
    );
  }

  const isCompanyRoute = location.pathname.startsWith('/company');
  const fallbackAuthPath = isCompanyRoute ? '/company/auth' : '/vendor/auth';

  if (!user) {
    return <Navigate to={fallbackAuthPath} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <PortalLayout>
          <Routes>
            {/* Public Entry Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/company/auth" element={<AuthPage />} />
            <Route path="/vendor/auth" element={<AuthPage />} />

            {/* Protected Enterprise Portal */}
            <Route
              path="/company"
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager', 'officer']}>
                  <CompanyHome />
                </ProtectedRoute>
              }
            />

            {/* Protected Vendor Portal */}
            <Route
              path="/vendor"
              element={
                <ProtectedRoute allowedRoles={['vendor']}>
                  <VendorHome />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PortalLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
