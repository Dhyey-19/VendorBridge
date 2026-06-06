import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'forgot'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('vendor'); // default signup as vendor
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password, rememberMe);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signup(name, email, password, role);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Mock forgot password flow
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSuccessMsg('If an account with that email exists, a reset link has been sent.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Building2 size={40} color="var(--primary)" style={{ marginBottom: '8px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 600 }}>VendorBridge ERP</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {activeTab === 'login' ? 'Sign in to your account' : activeTab === 'signup' ? 'Create a new account' : 'Reset your password'}
          </p>
        </div>

        {activeTab !== 'forgot' && (
          <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid var(--border)' }}>
            <button 
              onClick={() => {setActiveTab('login'); setError(''); setSuccessMsg('');}} 
              style={{ flex: 1, padding: '10px', borderBottom: activeTab === 'login' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'login' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'login' ? 600 : 400 }}
            >
              Sign In
            </button>
            <button 
              onClick={() => {setActiveTab('signup'); setError(''); setSuccessMsg('');}} 
              style={{ flex: 1, padding: '10px', borderBottom: activeTab === 'signup' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'signup' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'signup' ? 600 : 400 }}
            >
              Sign Up
            </button>
          </div>
        )}

        {error && <div style={{ padding: '10px', background: 'var(--danger)', color: 'white', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        {successMsg && <div style={{ padding: '10px', background: 'var(--success)', color: 'white', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{successMsg}</div>}

        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Email Address</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500 }}>Password</label>
                <button type="button" onClick={() => setActiveTab('forgot')} style={{ fontSize: '13px', color: 'var(--primary)' }}>Forgot Password?</button>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} className="input" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '10px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
              <label htmlFor="rememberMe" style={{ fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer' }}>Remember me</label>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Full Name</label>
              <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Email Address</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} className="input" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '10px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Account Type</label>
              <select className="input" value={role} onChange={e => setRole(e.target.value)}>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Email Address</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
            <button type="button" onClick={() => {setActiveTab('login'); setSuccessMsg('');}} className="btn btn-outline" style={{ width: '100%' }}>
              Back to Login
            </button>
          </form>
        )}

        {activeTab === 'login' && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Demo Credentials:</p>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'grid', gap: '8px' }}>
              <div style={{ background: '#f3f4f6', padding: '8px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => {setEmail('admin@globalprocure.com'); setPassword('Password123!');}}>
                <strong>Admin:</strong> admin@globalprocure.com (Password123!)
              </div>
              <div style={{ background: '#f3f4f6', padding: '8px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => {setEmail('dhyeyshah009@gmail.com'); setPassword('000000');}}>
                <strong>Vendor:</strong> dhyeyshah009@gmail.com (000000)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
