import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Building2, Store, LogOut, Bell, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
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
      borderColor: 'rgba(59, 130, 246, 0.3)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)'
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
              <Link to="/vendor/profile" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Profile</Link>
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
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{ color: 'var(--text-secondary)', position: 'relative', cursor: 'pointer', background: 'none', border: 'none' }}
                >
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
                {showNotifications && (
                  <div style={{
                    position: 'absolute', top: '40px', right: '-10px', width: '300px',
                    background: 'var(--bg-secondary)', borderRadius: '12px', padding: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)', border: '1px solid var(--border-light)', zIndex: 50
                  }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Notifications</h4>
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>
                      No new notifications
                    </div>
                  </div>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => setShowProfile(!showProfile)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px', borderLeft: '1px solid var(--border-light)', cursor: 'pointer' }}
                >
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
                </div>

                {showProfile && (
                  <div style={{
                    position: 'absolute', top: '50px', right: '0', width: '200px',
                    background: 'var(--bg-secondary)', borderRadius: '12px', padding: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)', border: '1px solid var(--border-light)', zIndex: 50
                  }}>
                    <Link 
                      to={isVendor ? "/vendor/profile" : "#"}
                      onClick={() => setShowProfile(false)}
                      style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderRadius: '8px', fontSize: '14px', color: 'var(--text-primary)' }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={16} /> Profile
                    </Link>
                    <div 
                      onClick={logout}
                      style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderRadius: '8px', fontSize: '14px', color: 'var(--error)' }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} /> Logout
                    </div>
                  </div>
                )}
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
