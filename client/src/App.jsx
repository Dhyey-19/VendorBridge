import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PortalLayout from './components/PortalLayout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import VendorHome from './vendor/pages/Home';

// New Company Pages
import Layout from './components/Layout';
import Dashboard from './company/pages/Dashboard';
import Vendors from './company/pages/Vendors';
import RFQs from './company/pages/RFQs';
import Quotations from './company/pages/Quotations';
import Approvals from './company/pages/Approvals';
import PurchaseOrders from './company/pages/PurchaseOrders';
import Invoices from './company/pages/Invoices';
import ActivityLogs from './company/pages/ActivityLogs';
import Reports from './company/pages/Reports';
import TeamManagement from './company/pages/TeamManagement';
import AcceptInvite from './pages/AcceptInvite';


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
        <Routes>
          {/* Public Entry Routes */}
          <Route path="/" element={<PortalLayout><LandingPage /></PortalLayout>} />
          <Route path="/company/auth" element={<PortalLayout><AuthPage /></PortalLayout>} />
          <Route path="/vendor/auth" element={<PortalLayout><AuthPage /></PortalLayout>} />
          <Route path="/accept-invite" element={<PortalLayout><AcceptInvite /></PortalLayout>} />

          {/* Protected Enterprise Portal */}
          <Route
            path="/company"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'officer']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/company/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="rfqs" element={<RFQs />} />
            <Route path="quotations" element={<Quotations />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="logs" element={<ActivityLogs />} />
            <Route path="reports" element={<Reports />} />
            <Route path="team" element={<TeamManagement />} />
          </Route>

          {/* Protected Vendor Portal */}
          <Route
            path="/vendor"
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <PortalLayout><VendorHome /></PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
