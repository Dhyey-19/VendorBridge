import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Building2, Store, LogOut, Bell, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const isVendor = path.startsWith('/vendor');
  const isCompany = path.startsWith('/company');

  let portalName = 'VendorBridge';
  let badgeText = '';
  let portalColorClass = '';

  if (isVendor) {
    portalName = 'VendorBridge';
    badgeText = 'Vendor Portal';
    portalColorClass = 'text-pink-500 border-pink-500/30 bg-pink-500/10';
  } else if (isCompany) {
    portalName = 'VendorBridge';
    badgeText = 'Company Portal';
    portalColorClass = 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
  }

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
            <Shield size={24} className={isVendor ? 'text-vendor' : isCompany ? 'text-company' : 'text-primary'} style={{ color: isVendor ? 'var(--accent-vendor)' : isCompany ? 'var(--accent-company)' : 'var(--primary)' }} />
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
              borderColor: isVendor ? 'rgba(236, 72, 153, 0.3)' : 'rgba(16, 185, 129, 0.3)',
              color: isVendor ? 'var(--accent-vendor)' : 'var(--accent-company)',
              backgroundColor: isVendor ? 'rgba(236, 72, 153, 0.1)' : 'rgba(16, 185, 129, 0.1)'
            }}>
              {badgeText}
            </span>
          )}
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {isVendor && (
            <>
              <Link to="/vendor" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Dashboard</Link>
              <Link to="/vendor/offers" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>My Offers</Link>
              <Link to="/vendor/profile" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Profile</Link>
            </>
          )}

          {isCompany && (
            <>
              <Link to="/company" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Dashboard</Link>
              <Link to="/company/requests" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>RFPs</Link>
              <Link to="/company/vendors" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Manage Vendors</Link>
            </>
          )}

          {!isVendor && !isCompany && (
            <>
              <a href="#features" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Features</a>
              <a href="#about" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>About</a>
            </>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {(isVendor || isCompany) ? (
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
                  color: isVendor ? 'var(--accent-vendor)' : 'var(--accent-company)'
                }}>
                  {isVendor ? <Store size={16} /> : <Building2 size={16} />}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>
                    {isVendor ? 'Acme Supplies' : 'Global Corp'}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {isVendor ? 'Vendor' : 'Client'}
                  </span>
                </div>
                
                <Link to="/" title="Log Out" style={{ marginLeft: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                  <LogOut size={18} />
                </Link>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/company" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '14px' }}>
                Company Access
              </Link>
              <Link to="/vendor" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px', background: 'var(--primary)' }}>
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
