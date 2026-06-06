import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users, FileQuestion, FileText, CheckSquare, ShoppingCart, FileSpreadsheet, BarChart3, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Vendors from './Vendors';
import RFQs from './RFQs';
import VendorProfile from './VendorProfile';
import Quotations from './Quotations';
import PurchaseOrders from './PurchaseOrders';
import Approvals from './Approvals';
import Invoices from './Invoices';
import Reports from './Reports';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/dashboard/stats', { headers: { Authorization: `Bearer ${token}` } });
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(user?.role === 'admin' ? [
      { id: 'vendors', label: 'Vendors', icon: Users },
    ] : []),
    ...(user?.role === 'vendor' ? [
      { id: 'profile', label: 'My Profile', icon: UserCircle },
    ] : []),
    { id: 'rfqs', label: 'RFQs', icon: FileQuestion },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare },
    { id: 'pos', label: 'Purchase Orders', icon: ShoppingCart },
    { id: 'invoices', label: 'Invoices', icon: FileSpreadsheet },
    ...(user?.role === 'admin' ? [
      { id: 'reports', label: 'Reports', icon: BarChart3 }
    ] : [])
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--primary)' }}>VendorBridge</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ERP System</p>
        </div>
        
        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px',
                background: activeTab === item.id ? 'var(--bg)' : 'transparent',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text)',
                borderLeft: activeTab === item.id ? '4px solid var(--primary)' : '4px solid transparent',
                textAlign: 'left', cursor: 'pointer', fontWeight: 500, borderTop: 'none', borderRight: 'none', borderBottom: 'none'
              }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px' }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 500, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.role.toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {activeTab === 'dashboard' ? (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Welcome back, {user?.name}</h1>
            
            {stats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {user.role === 'admin' && (
                  <div className="card">
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Vendors</p>
                    <p style={{ fontSize: '28px', fontWeight: 600 }}>{stats.vendorsCount}</p>
                  </div>
                )}
                {user.role === 'admin' && (
                  <div className="card">
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Pending Approvals</p>
                    <p style={{ fontSize: '28px', fontWeight: 600 }}>{stats.pendingApprovalsCount}</p>
                  </div>
                )}
                <div className="card">
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Active RFQs</p>
                  <p style={{ fontSize: '28px', fontWeight: 600 }}>{stats.activeRfqs}</p>
                </div>
                <div className="card">
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Purchase Orders</p>
                  <p style={{ fontSize: '28px', fontWeight: 600 }}>{stats.purchaseOrdersCount}</p>
                </div>
                <div className="card">
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Invoices</p>
                  <p style={{ fontSize: '28px', fontWeight: 600 }}>{stats.invoicesCount}</p>
                </div>
              </div>
            )}

            {stats?.recentActivities && (
              <div className="card">
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Recent Activity</h3>
                <ul style={{ listStyle: 'none' }}>
                  {stats.recentActivities.map(activity => (
                    <li key={activity.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 500, fontSize: '14px' }}>{activity.action}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {activity.user} • {new Date(activity.time).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                  {stats.recentActivities.length === 0 && (
                    <li style={{ padding: '12px 0', color: 'var(--text-muted)' }}>No recent activity.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : activeTab === 'vendors' ? (
          <Vendors />
        ) : activeTab === 'rfqs' ? (
          <RFQs />
        ) : activeTab === 'profile' ? (
          <VendorProfile />
        ) : activeTab === 'quotations' ? (
          <Quotations />
        ) : activeTab === 'approvals' ? (
          <Approvals />
        ) : activeTab === 'pos' ? (
          <PurchaseOrders />
        ) : activeTab === 'reports' ? (
          <Reports />
        ) : activeTab === 'invoices' ? (
          <Invoices />
        ) : (
          <div className="card">Module under development.</div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
