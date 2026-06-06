import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Mail, Lock, User, Building, Store, Hash, 
  MapPin, List, Eye, EyeOff, Phone, ArrowLeft, ChevronRight 
} from 'lucide-react';
import './AuthPage.css';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, login, loginOtp, registerCompany, registerVendor, sendOtp } = useAuth();

  // Determine portal from URL on initial load, or default to 'select'
  const isUrlCompany = location.pathname.includes('/company');
  const isUrlVendor = location.pathname.includes('/vendor');
  
  const [portalMode, setPortalMode] = useState(
    isUrlCompany ? 'company' : isUrlVendor ? 'vendor' : 'select'
  );

  const isCompany = portalMode === 'company';
  const portalName = isCompany ? 'Company Portal' : 'Vendor Portal';

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      if (user.role === 'vendor') {
        navigate('/vendor');
      } else {
        navigate('/company');
      }
    }
  }, [user, loading, navigate]);

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

  const handlePortalSelect = (mode) => {
    setPortalMode(mode);
    setErrorMsg('');
    setInfoMsg('');
    // Synchronize browser URL
    if (mode === 'company') {
      navigate('/company/auth');
    } else if (mode === 'vendor') {
      navigate('/vendor/auth');
    }
  };

  const handleBackToSelector = () => {
    setPortalMode('select');
    setErrorMsg('');
    setInfoMsg('');
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
          // Allow authentication hook to redirect
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
    <div className="auth-page-wrapper">
      {/* Background Animated Blobs */}
      <div className={`auth-glow-blob auth-glow-company ${portalMode === 'vendor' ? 'opacity-0' : ''}`} />
      <div className={`auth-glow-blob auth-glow-vendor ${portalMode === 'company' ? 'opacity-0' : ''}`} />

      {portalMode === 'select' ? (
        /* ==================== SELECT PORTAL SCREEN ==================== */
        <div className="portal-selection-container">
          <div className="portal-selection-header">
            <h1 className="animate-fade-in">Welcome to VendorBridge</h1>
            <p className="animate-fade-in">Select your workspace portal to authenticate and manage procurement</p>
          </div>

          <div className="portal-selection-grid">
            {/* Company Choice Card */}
            <div 
              className="portal-choice-card company-choice-card"
              onClick={() => handlePortalSelect('company')}
            >
              <div className="portal-card-icon-wrapper">
                <Building size={32} />
              </div>
              <h2>Company Portal</h2>
              <p>For procurement officers, managers, and system administrators to launch RFQs, review bids, and manage approvals.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '24px', color: '#10b981', fontWeight: 600, fontSize: '14px' }}>
                Enter Portal <ChevronRight size={16} />
              </div>
            </div>

            {/* Vendor Choice Card */}
            <div 
              className="portal-choice-card vendor-choice-card"
              onClick={() => handlePortalSelect('vendor')}
            >
              <div className="portal-card-icon-wrapper">
                <Store size={32} />
              </div>
              <h2>Vendor Portal</h2>
              <p>For external suppliers and vendors to view available invitations, submit pricing quotations, and manage generated invoices.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '24px', color: '#3b82f6', fontWeight: 600, fontSize: '14px' }}>
                Enter Portal <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== FORM PANEL SCREEN ==================== */
        <div className="auth-form-panel">
          {/* Back to Selector Link */}
          <button 
            type="button" 
            className="auth-back-button"
            onClick={handleBackToSelector}
          >
            <ArrowLeft size={16} />
            Back to Portal Selector
          </button>

          {/* Form Header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: isCompany ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isCompany ? '#10b981' : '#3b82f6',
              }}>
                {isCompany ? <Building size={20} /> : <Store size={20} />}
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                {portalName}
              </h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              {activeTab === 'signin' ? 'Provide credentials to access your portal' : 'Submit register application'}
            </p>
          </div>

          {/* Sign In vs Signup Tabs */}
          <div className="auth-tabs-wrapper">
            <button
              type="button"
              className={`${activeTab === 'signin' ? 'active' : ''} ${
                activeTab === 'signin' ? (isCompany ? 'company-active' : 'vendor-active') : ''
              }`}
              onClick={() => { setActiveTab('signin'); setErrorMsg(''); setInfoMsg(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`${activeTab === 'signup' ? 'active' : ''} ${
                activeTab === 'signup' ? (isCompany ? 'company-active' : 'vendor-active') : ''
              }`}
              onClick={() => { setActiveTab('signup'); setErrorMsg(''); setInfoMsg(''); }}
            >
              Register
            </button>
          </div>

          {/* Error and Info Alerts */}
          {errorMsg && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '13px',
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
              borderRadius: '10px',
              fontSize: '13px',
              marginBottom: '20px',
              fontWeight: 500
            }}>
              {infoMsg}
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit}>
            {/* Login Method Radio Tabs (Sign in only) */}
            {activeTab === 'signin' && (
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                fontSize: '13px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                paddingBottom: '12px'
              }}>
                <span style={{ color: '#64748b' }}>Login method:</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#ffffff', fontWeight: loginMethod === 'password' ? 600 : 400 }}>
                  <input
                    type="radio"
                    name="loginMethod"
                    checked={loginMethod === 'password'}
                    onChange={() => setLoginMethod('password')}
                    style={{ accentColor: isCompany ? '#10b981' : '#3b82f6' }}
                  />
                  Password
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#ffffff', fontWeight: loginMethod === 'otp' ? 600 : 400 }}>
                  <input
                    type="radio"
                    name="loginMethod"
                    checked={loginMethod === 'otp'}
                    onChange={() => setLoginMethod('otp')}
                    style={{ accentColor: isCompany ? '#10b981' : '#3b82f6' }}
                  />
                  Email OTP
                </label>
              </div>
            )}

            {/* Field: Full Name (Register only) */}
            {activeTab === 'signup' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="auth-input-container">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <span className="auth-input-icon">
                    <User size={18} />
                  </span>
                </div>
              </div>
            )}

            {/* Field: Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-container">
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="auth-input-icon">
                  <Mail size={18} />
                </span>
              </div>
            </div>

            {/* Field: Password (Register OR Signin with Password) */}
            {(activeTab === 'signup' || (activeTab === 'signin' && loginMethod === 'password')) && (
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="auth-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    style={{ paddingRight: '44px !important' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="auth-input-icon">
                    <Lock size={18} />
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Fields: Company Register Specific */}
            {activeTab === 'signup' && isCompany && (
              <>
                <div className="form-group">
                  <label className="form-label">Associated Enterprise</label>
                  <div className="auth-input-container">
                    <input
                      type="text"
                      className="form-control"
                      value={companyName}
                      readOnly
                      style={{ opacity: 0.7 }}
                    />
                    <span className="auth-input-icon">
                      <Building size={18} />
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                    Company accounts register under the shared Apex tenant.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Procurement Role</label>
                  <div className="auth-input-container">
                    <select
                      className="form-control"
                      value={companyRole}
                      onChange={(e) => setCompanyRole(e.target.value)}
                    >
                      <option value="officer">Procurement Officer (Create RFQs, Compare Bids)</option>
                      <option value="manager">Manager / Approver (Process Approvals)</option>
                      <option value="admin">System Administrator (Manage Users & Vendors)</option>
                    </select>
                    <span className="auth-input-icon">
                      <Shield size={18} />
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Fields: Vendor Register Specific */}
            {activeTab === 'signup' && !isCompany && (
              <>
                <div className="form-group">
                  <label className="form-label">Vendor Store / Brand Name</label>
                  <div className="auth-input-container">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Gopal Logistics Services"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      required
                    />
                    <span className="auth-input-icon">
                      <Store size={18} />
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Service Category</label>
                  <div className="auth-input-container">
                    <select
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="IT & Software">IT, Software, & Infrastructure</option>
                      <option value="Logistics & Fleet">Logistics, Fleet, & Transport</option>
                      <option value="Office Supplies">Office Furniture & Supplies</option>
                      <option value="Industrial Hardware">Industrial & Raw Hardware</option>
                    </select>
                    <span className="auth-input-icon">
                      <List size={18} />
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">GST Details / Tax Code</label>
                  <div className="auth-input-container">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 27AAAAA1111A1Z1"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      required
                    />
                    <span className="auth-input-icon">
                      <Hash size={18} />
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Office / Billing Address</label>
                  <div className="auth-input-container">
                    <textarea
                      className="form-control"
                      style={{ paddingLeft: '48px', minHeight: '64px', resize: 'vertical' }}
                      placeholder="Enter full physical address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    ></textarea>
                    <span className="auth-input-icon" style={{ top: '22px' }}>
                      <MapPin size={18} />
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <div className="auth-input-container">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                    <span className="auth-input-icon">
                      <MapPin size={18} />
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="auth-input-container">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. +91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <span className="auth-input-icon">
                      <Phone size={18} />
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Field: OTP Verification (Signup OR Signin with OTP) */}
            {(activeTab === 'signup' || (activeTab === 'signin' && loginMethod === 'otp')) && (
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 125px', gap: '12px' }}>
                <div>
                  <label className="form-label">Email OTP Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    style={{ paddingLeft: '16px !important' }}
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
                      borderRadius: '12px',
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                      background: 'rgba(255,255,255,0.02)',
                      color: countdown > 0 ? '#64748b' : '#ffffff'
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
              style={{ 
                width: '100%', 
                padding: '14px 0', 
                marginTop: '24px', 
                fontSize: '15px', 
                borderRadius: '12px',
                fontWeight: 600,
                boxShadow: isCompany ? '0 8px 20px rgba(16, 185, 129, 0.2)' : '0 8px 20px rgba(59, 130, 246, 0.2)'
              }}
            >
              {submitting ? 'Authenticating...' : activeTab === 'signin' ? 'Sign In Account' : 'Register Account'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
