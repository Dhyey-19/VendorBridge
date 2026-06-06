import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Building2, Store, LogOut, Bell } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const path = location.pathname;

  const isVendor = user && user.role === 'vendor';
  const isCompany = user && ['admin', 'manager', 'officer'].includes(user.role);

  let portalName = 'VendorBridge';
  let badgeText = '';
  
  if (isVendor) {
    portalName = 'VendorBridge';
    badgeText = 'Vendor Portal';
  } else if (isCompany) {
    portalName = 'VendorBridge';
    
    // Map roles to pretty names
    if (user.role === 'admin') badgeText = 'Admin Portal';
    else if (user.role === 'manager') badgeText = 'Manager Portal';
    else if (user.role === 'officer') badgeText = 'Procurement Officer';
  }

  const getRoleColorStyles = () => {
    if (user?.role === 'admin') {
      return {
        color: 'var(--primary)',
        borderColor: 'rgba(79, 70, 229, 0.3)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)'
      };
    }
    if (user?.role === 'manager') {
      return {
        color: 'var(--accent-company)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      };
    }
    if (user?.role === 'officer') {
      return {
        color: 'var(--secondary)',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)'
      };
    }
    return {
      color: 'var(--accent-vendor)',
      borderColor: 'rgba(236, 72, 153, 0.3)',
      backgroundColor: 'rgba(236, 72, 153, 0.1)'
    };
  };

  const roleStyles = getRoleColorStyles();

  return (
    <header className="navbar-header glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: '0 0 16px 16px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '16px 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>
            <Shield size={24} style={{ color: isVendor ? 'var(--accent-vendor)' : isCompany ? 'var(--accent-company)' : 'var(--primary)' }} />
            <span>{portalName}</span>
          </Link>
          
          {badgeText && (
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '4px 10px',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: roleStyles.borderColor,
              color: roleStyles.color,
              backgroundColor: roleStyles.backgroundColor
            }}>
              {badgeText}
            </span>
          )}
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {isVendor && (
            <>
              <Link to="/vendor" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Dashboard</Link>
              <Link to="#" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>My Offers</Link>
              <Link to="#" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Profile</Link>
            </>
          )}

          {isCompany && (
            <>
              <Link to="/company" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Dashboard</Link>
              {user.role === 'officer' && <Link to="#" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>RFPs</Link>}
              {user.role === 'manager' && <Link to="#" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Pending approvals</Link>}
              {user.role === 'admin' && <Link to="#" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Manage Vendors</Link>}
            </>
          )}

          {!user && (
            <>
              <a href="#features" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Features</a>
              <a href="#about" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>About</a>
            </>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <button style={{ color: 'var(--text-secondary)', position: 'relative', cursor: 'pointer' }}>
                <Bell size={20} />
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--error)',
                  borderRadius: '50%'
                }}></span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px', borderLeft: '1px solid var(--border-light)' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: roleStyles.color
                }}>
                  {isVendor ? <Store size={16} /> : <Building2 size={16} />}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>
                    {user.name}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {user.role === 'vendor' ? 'Vendor Partner' : 'Enterprise'}
                  </span>
                </div>
                
                <button
                  onClick={logout}
                  title="Log Out"
                  style={{
                    marginLeft: '12px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/company/auth" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '14px' }}>
                Company Access
              </Link>
              <Link to="/vendor/auth" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px', background: 'var(--primary)' }}>
                Vendor Access
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
