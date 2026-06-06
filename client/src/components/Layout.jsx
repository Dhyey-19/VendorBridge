import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FileQuestion, 
  ClipboardList, 
  CheckSquare, 
  ShoppingCart, 
  FileSpreadsheet, 
  History, 
  BarChart3,
  LogOut,
  Bell,
  UserCog
} from 'lucide-react';
import './Layout.css';

function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/company/auth');
  };

  const navItems = [
    { path: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/company/vendors', label: 'Vendors', icon: Users },
    { path: '/company/team', label: 'Team Management', icon: UserCog },
    { path: '/company/rfqs', label: 'RFQs', icon: FileQuestion },
    { path: '/company/quotations', label: 'Quotations', icon: FileText },
    { path: '/company/approvals', label: 'Approvals', icon: CheckSquare },
    { path: '/company/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
    { path: '/company/invoices', label: 'Invoices', icon: FileSpreadsheet },
    { path: '/company/logs', label: 'Activity Logs', icon: History },
    { path: '/company/reports', label: 'Reports', icon: BarChart3 },
  ];

  const getInitials = (name) => {
    if (!name) return 'VB';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Manager';
      case 'officer': return 'Procurement Officer';
      default: return 'Staff';
    }
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">VB</div>
          <h2>VendorBridge</h2>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              <item.icon className="nav-icon" size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut className="nav-icon" size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-search">
            <input type="text" placeholder="Search everywhere..." />
          </div>
          <div className="topbar-actions">
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
              <span className="badge-indicator"></span>
            </button>
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>Notifications</h4>
                </div>
                <div className="notifications-body">
                  <div className="notification-item text-muted text-sm text-center py-4">
                    No new notifications
                  </div>
                </div>
              </div>
            )}
            <div className="user-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="avatar">{getInitials(user?.name)}</div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'Enterprise Operator'}</span>
                <span className="user-role">{getRoleLabel(user?.role)}</span>
              </div>
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <div className="page-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
