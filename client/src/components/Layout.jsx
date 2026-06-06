import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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
  Bell
} from 'lucide-react';
import './Layout.css';

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/company/auth');
  };

  const navItems = [
    { path: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/company/vendors', label: 'Vendors', icon: Users },
    { path: '/company/rfqs', label: 'RFQs', icon: FileQuestion },
    { path: '/company/quotations', label: 'Quotations', icon: FileText },
    { path: '/company/approvals', label: 'Approvals', icon: CheckSquare },
    { path: '/company/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
    { path: '/company/invoices', label: 'Invoices', icon: FileSpreadsheet },
    { path: '/company/logs', label: 'Activity Logs', icon: History },
    { path: '/company/reports', label: 'Reports', icon: BarChart3 },
  ];

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
            <button className="icon-btn">
              <Bell size={20} />
              <span className="badge-indicator"></span>
            </button>
            <div className="user-profile">
              <div className="avatar">PO</div>
              <div className="user-info">
                <span className="user-name">John Doe</span>
                <span className="user-role">Procurement Officer</span>
              </div>
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
