import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, User, Building, Store, Hash, MapPin, List, Eye, EyeOff, Phone } from 'lucide-react';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, login, loginOtp, registerCompany, registerVendor, sendOtp } = useAuth();

  const isCompany = location.pathname.includes('/company');
  const portalName = isCompany ? 'Company Portal' : 'Vendor Portal';

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate(isCompany ? '/company' : '/vendor');
    }
  }, [user, loading, navigate, isCompany]);

  // Tabs: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState('signin');
  // Login Sub-tabs: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState('password');

  // Shared Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Fields
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Company Specific fields
  const [companyRole, setCompanyRole] = useState('officer'); // admin | manager | officer
  const [companyName, setCompanyName] = useState('Apex Procurement Inc'); // Read-only shared company

  // Vendor Specific fields
  const [vendorName, setVendorName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('IT & Software');

  // Feedback State
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!email) {
      setErrorMsg('Please enter your email address first.');
      return;
    }
    setErrorMsg('');
    setInfoMsg('');
    
    const mode = activeTab === 'signin' ? 'login' : 'signup';
    setSubmitting(true);
    const res = await sendOtp(email, mode);
    setSubmitting(false);

    if (res.success) {
      setOtpSent(true);
      setCountdown(60);
      setInfoMsg('Verification OTP has been dispatched to your email.');
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setSubmitting(true);

    try {
      if (activeTab === 'signin') {
        let res;
        if (loginMethod === 'password') {
          res = await login(email, password);
        } else {
          res = await loginOtp(email, otp);
        }

        if (res.success) {
          navigate(isCompany ? '/company' : '/vendor');
        } else {
          setErrorMsg(res.error);
        }
      } else {
        // Registration
        if (isCompany) {
          const companyData = {
            email,
            password,
            name,
            companyName, // Apex Procurement Inc (Shared)
            industry: 'Corporate Procurement',
            gstNumber: 'GSTIN12345COMPANY',
            address: 'Mumbai Headquarters',
            role: companyRole,
            otp
          };
          
          const res = await registerCompany(companyData);
          if (res.success) {
            navigate('/company');
          } else {
            setErrorMsg(res.error);
          }
        } else {
          // Vendor
          const vendorData = {
            email,
            password,
            name,
            vendorName,
            category: [category],
            gstNumber,
            address,
            city,
            phone,
            otp
          };
          
          const res = await registerVendor(vendorData);
          if (res.success) {
            navigate('/vendor');
          } else {
            setErrorMsg(res.error);
          }
        }
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto 80px auto', position: 'relative' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: isCompany ? 'rgba(16, 185, 129, 0.1)' : 'rgba(236, 72, 153, 0.1)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isCompany ? 'var(--accent-company)' : 'var(--accent-vendor)',
          marginBottom: '16px',
          border: '1px solid',
          borderColor: isCompany ? 'rgba(16, 185, 129, 0.2)' : 'rgba(236, 72, 153, 0.2)'
        }}>
          <Shield size={28} />
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800 }}>
          {isCompany ? 'Company Portal' : 'Vendor Portal'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
          {activeTab === 'signin' ? 'Sign in to access your dashboard' : 'Create a new procurement account'}
        </p>
      </div>

      {/* Main Glass Panel */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
        
        {/* Sign In vs Signup Tab Selectors */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-light)',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '28px'
        }}>
          <button
            onClick={() => { setActiveTab('signin'); setErrorMsg(''); setInfoMsg(''); }}
            style={{
              padding: '10px 0',
              fontWeight: 600,
              fontSize: '14px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: activeTab === 'signin' ? '#ffffff' : 'var(--text-secondary)',
              background: activeTab === 'signin' ? (isCompany ? 'var(--accent-company)' : 'var(--accent-vendor)') : 'none',
              boxShadow: activeTab === 'signin' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setErrorMsg(''); setInfoMsg(''); }}
            style={{
              padding: '10px 0',
              fontWeight: 600,
              fontSize: '14px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: activeTab === 'signup' ? '#ffffff' : 'var(--text-secondary)',
              background: activeTab === 'signup' ? (isCompany ? 'var(--accent-company)' : 'var(--accent-vendor)') : 'none',
              boxShadow: activeTab === 'signup' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Register
          </button>
        </div>

        {/* Display Alert Messages */}
        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '20px',
            fontWeight: 500
          }}>
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#34d399',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '20px',
            fontWeight: 500
          }}>
            {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Sign In View Options */}
          {activeTab === 'signin' && (
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '24px',
              fontSize: '13px',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '12px'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>Login method:</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: loginMethod === 'password' ? 600 : 400 }}>
                <input
                  type="radio"
                  name="loginMethod"
                  checked={loginMethod === 'password'}
                  onChange={() => setLoginMethod('password')}
                  style={{ accentColor: isCompany ? 'var(--accent-company)' : 'var(--accent-vendor)' }}
                />
                Password
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: loginMethod === 'otp' ? 600 : 400 }}>
                <input
                  type="radio"
                  name="loginMethod"
                  checked={loginMethod === 'otp'}
                  onChange={() => setLoginMethod('otp')}
                  style={{ accentColor: isCompany ? 'var(--accent-company)' : 'var(--accent-vendor)' }}
                />
                Email OTP
              </label>
            </div>
          )}

          {/* Form Fields: Name (Sign up only) */}
          {activeTab === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <User size={18} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '48px' }}
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Form Fields: Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Mail size={18} />
              </span>
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '48px' }}
                placeholder="name@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Form Fields: Password (Sign in via Password OR Sign up) */}
          {(activeTab === 'signup' || (activeTab === 'signin' && loginMethod === 'password')) && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '48px', paddingRight: '44px' }}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Company Signup specific fields */}
          {activeTab === 'signup' && isCompany && (
            <>
              <div className="form-group">
                <label className="form-label">Associated Enterprise</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Building size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '48px', backgroundColor: 'rgba(255, 255, 255, 0.01)', color: 'var(--text-secondary)' }}
                    value={companyName}
                    readOnly
                  />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                  All company accounts are mapped to your main tenant: Apex Procurement Inc.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Procurement Role</label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="form-control"
                    value={companyRole}
                    onChange={(e) => setCompanyRole(e.target.value)}
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="officer">Procurement Officer (Create RFQs, Compare Bids)</option>
                    <option value="manager">Manager / Approver (Process Approvals)</option>
                    <option value="admin">System Administrator (Manage Users & Vendors)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Vendor Signup specific fields */}
          {activeTab === 'signup' && !isCompany && (
            <>
              <div className="form-group">
                <label className="form-label">Vendor Store / Brand Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Store size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '48px' }}
                    placeholder="e.g. Gopal Logistics Services"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Service Category</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <List size={18} />
                  </span>
                  <select
                    className="form-control"
                    style={{ paddingLeft: '48px' }}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="IT & Software">IT, Software, & Infrastructure</option>
                    <option value="Logistics & Fleet">Logistics, Fleet, & Transport</option>
                    <option value="Office Supplies">Office Furniture & Supplies</option>
                    <option value="Industrial Hardware">Industrial & Raw Hardware</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">GST Details / Tax Code</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Hash size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '48px' }}
                    placeholder="e.g. 27AAAAA1111A1Z1"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Office / Billing Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }}>
                    <MapPin size={18} />
                  </span>
                  <textarea
                    className="form-control"
                    style={{ paddingLeft: '48px', minHeight: '64px', resize: 'vertical' }}
                    placeholder="Enter full vendor physical address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <MapPin size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '48px' }}
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Phone size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '48px' }}
                    placeholder="e.g. +91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* OTP Generation Code Row (Sign in OTP OR Signup) */}
          {(activeTab === 'signup' || (activeTab === 'signin' && loginMethod === 'otp')) && (
            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px' }}>
              <div>
                <label className="form-label">Email OTP Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={countdown > 0 || submitting}
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    padding: '12px 8px',
                    fontSize: '12px',
                    height: '46px',
                    borderColor: countdown > 0 ? 'rgba(255,255,255,0.02)' : 'var(--border-light)',
                    color: countdown > 0 ? 'var(--text-muted)' : 'var(--text-primary)'
                  }}
                >
                  {countdown > 0 ? `Resend (${countdown}s)` : otpSent ? 'Resend OTP' : 'Request OTP'}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={isCompany ? 'btn btn-company' : 'btn btn-vendor'}
            disabled={submitting}
            style={{ width: '100%', padding: '14px 0', marginTop: '24px', fontSize: '15px' }}
          >
            {submitting ? 'Please wait...' : activeTab === 'signin' ? 'Sign In Account' : 'Finalize Registration'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AuthPage;
