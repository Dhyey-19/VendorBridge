import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Store, ArrowRight, ShieldCheck, Zap, BarChart3, Lock } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '80px', position: 'relative' }}>
        <span style={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          display: 'inline-block',
          marginBottom: '16px',
          padding: '4px 12px',
          background: 'rgba(79, 70, 229, 0.1)',
          borderRadius: '20px'
        }}>
          Next-Gen Vendor Management
        </span>
        <h1 style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
          Bridge the Gap Between <br />
          <span className="gradient-text">Enterprise and Vendors</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '20px', maxWidth: '640px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
          A unified premium MERN ecosystem for managing requests, bidding on jobs, and managing contracts in real-time.
        </p>
      </div>

      {/* Portal Selection Cards */}
      <div className="grid-cols-2" style={{ maxWidth: '960px', margin: '0 auto 100px auto', gap: '32px' }}>
        {/* Company Card */}
        <div className="glass-panel" style={{
          padding: '40px',
          borderRadius: '24px',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '340px',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          background: 'radial-gradient(100% 100% at 0% 0%, rgba(16, 185, 129, 0.05) 0%, rgba(18, 24, 41, 0.9) 100%)'
        }}>
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-company)',
              marginBottom: '28px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <Building2 size={32} />
            </div>
            
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
              I am a <span className="gradient-text-company">Company</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
              Post request for proposals (RFPs), search verified vendors, compare bids, track contracts, and manage vendor compliance in a unified workspace.
            </p>
          </div>

          <Link to="/company" className="btn btn-company" style={{ width: '100%', padding: '14px 28px' }}>
            Enter Company Portal <ArrowRight size={18} />
          </Link>
        </div>

        {/* Vendor Card */}
        <div className="glass-panel" style={{
          padding: '40px',
          borderRadius: '24px',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '340px',
          border: '1px solid rgba(236, 72, 153, 0.15)',
          background: 'radial-gradient(100% 100% at 0% 0%, rgba(236, 72, 153, 0.05) 0%, rgba(18, 24, 41, 0.9) 100%)'
        }}>
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'rgba(236, 72, 153, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-vendor)',
              marginBottom: '28px',
              border: '1px solid rgba(236, 72, 153, 0.2)'
            }}>
              <Store size={32} />
            </div>
            
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
              I am a <span className="gradient-text-vendor">Vendor</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
              Bid on open RFPs, showcase your products and services, upload compliance documentation, track invoice approvals, and grow your enterprise business.
            </p>
          </div>

          <Link to="/vendor" className="btn btn-vendor" style={{ width: '100%', padding: '14px 28px' }}>
            Enter Vendor Portal <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Feature Grid Section */}
      <div id="features" style={{ paddingTop: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>Complete Core Capabilities</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Built on a secure, scalable MERN stack codebase.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          <div className="glass-card">
            <div style={{ color: 'var(--primary)', marginBottom: '16px' }}><ShieldCheck size={28} /></div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Verified Profiles</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>Rigorous authentication and identity verification for all companies and vendors.</p>
          </div>

          <div className="glass-card">
            <div style={{ color: 'var(--secondary)', marginBottom: '16px' }}><Zap size={28} /></div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Instant Bidding</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>Send, modify, and review bids instantly using React state and socket-ready configurations.</p>
          </div>

          <div className="glass-card">
            <div style={{ color: 'var(--accent-vendor)', marginBottom: '16px' }}><BarChart3 size={28} /></div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Smart Analytics</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>Comprehensive metrics dashboards for spend profiles, bid win-rates, and task cycles.</p>
          </div>

          <div className="glass-card">
            <div style={{ color: 'var(--accent-company)', marginBottom: '16px' }}><Lock size={28} /></div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Data Encrypted</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>All contract and pricing fields are protected via server-side encryption and JWT layers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
