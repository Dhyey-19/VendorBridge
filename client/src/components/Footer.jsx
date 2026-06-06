import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-light)',
      padding: '48px 0 24px 0',
      marginTop: 'auto',
      position: 'relative',
      zIndex: 1
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '20px', marginBottom: '16px' }}>
              <Shield size={24} style={{ color: 'var(--primary)' }} />
              <span>VendorBridge</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              A premium, secure collaboration portal connecting enterprises with verified vendors.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Portals</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><a href="/company" style={{ color: 'var(--text-secondary)' }}>Company Portal</a></li>
              <li><a href="/vendor" style={{ color: 'var(--text-secondary)' }}>Vendor Portal</a></li>
              <li><a href="/" style={{ color: 'var(--text-secondary)' }}>Landing Home</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><a href="#" style={{ color: 'var(--text-secondary)' }}>Documentation</a></li>
              <li><a href="#" style={{ color: 'var(--text-secondary)' }}>API Reference</a></li>
              <li><a href="#" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><a href="#" style={{ color: 'var(--text-secondary)' }}>Help Center</a></li>
              <li><a href="#" style={{ color: 'var(--text-secondary)' }}>Security Reports</a></li>
              <li><a href="#" style={{ color: 'var(--text-secondary)' }}>Contact Sales</a></li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}>
          <span>&copy; {new Date().getFullYear()} VendorBridge Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: 'inherit' }}>Terms of Service</a>
            <a href="#" style={{ color: 'inherit' }}>Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
