import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Plus, DollarSign, Users, Briefcase, FileText, CheckCircle, XCircle, ShieldCheck, UserPlus } from 'lucide-react';

const CompanyHome = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'officer'; // default to officer if not set

  // Mock Data & State
  const [rfps, setRfps] = useState([
    { id: 1, title: 'Enterprise Cloud Infrastructure Migration', budget: '$45,000', bidsCount: 2, status: 'Open' },
    { id: 2, title: 'Office Hardware Supply & Setup', budget: '$12,500', bidsCount: 1, status: 'Open' },
    { id: 3, title: 'AI-Based Customer Support Chatbot', budget: '$28,000', bidsCount: 0, status: 'Open' }
  ]);

  const [receivedBids, setReceivedBids] = useState([
    { id: 201, rfpTitle: 'Enterprise Cloud Infrastructure Migration', vendor: 'Infosys Corp', amount: '$43,000', date: '2026-06-05', status: 'Pending' },
    { id: 202, rfpTitle: 'Enterprise Cloud Infrastructure Migration', vendor: 'TechSolutions Inc', amount: '$46,500', date: '2026-06-06', status: 'Pending' },
    { id: 203, rfpTitle: 'Office Hardware Supply & Setup', vendor: 'Acme Supplies', amount: '$11,800', date: '2026-06-06', status: 'Pending' }
  ]);

  // Admin Mock Database
  const [vendors, setVendors] = useState([
    { id: 301, name: 'Infosys Corp', category: 'IT & Cloud Services', gst: 'GSTIN88990INFO', status: 'Approved' },
    { id: 302, name: 'Acme Supplies', category: 'Hardware Supplies', gst: 'GSTIN88209ACME', status: 'Approved' },
    { id: 303, name: 'Gopal Logistics Services', category: 'Transportation & Logistics', gst: 'GSTIN54321VENDOR', status: 'Pending' }
  ]);

  const [staffUsers, setStaffUsers] = useState([
    { id: 401, name: 'John Admin', email: 'admin@apex.com', role: 'admin', status: 'active' },
    { id: 402, name: 'Sarah Approver', email: 'approver@apex.com', role: 'manager', status: 'active' },
    { id: 403, name: 'Gopal Officer', email: 'officer@apex.com', role: 'officer', status: 'active' }
  ]);

  // Tab selections depend on role
  // officer: 'rfps' | 'incoming-bids'
  // manager: 'incoming-bids' | 'rfps'
  // admin: 'vendors' | 'staff'
  const defaultTab = userRole === 'admin' ? 'vendors' : userRole === 'manager' ? 'incoming-bids' : 'rfps';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [rfpTitle, setRfpTitle] = useState('');
  const [rfpBudget, setRfpBudget] = useState('');
  const [rfpDesc, setRfpDesc] = useState('');
  
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRoleSelect, setStaffRoleSelect] = useState('officer');

  const [notification, setNotification] = useState('');

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setRfpTitle('');
    setRfpBudget('');
    setRfpDesc('');
  };

  const handleCreateRfp = (e) => {
    e.preventDefault();
    if (!rfpTitle || !rfpBudget) return;

    const newRfp = {
      id: Date.now(),
      title: rfpTitle,
      budget: `$${Number(rfpBudget).toLocaleString()}`,
      bidsCount: 0,
      status: 'Open'
    };

    setRfps([newRfp, ...rfps]);
    setIsCreateModalOpen(false);
    setNotification(`Successfully published new RFP: ${rfpTitle}`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();
    if (!staffName || !staffEmail) return;

    const newStaff = {
      id: Date.now(),
      name: staffName,
      email: staffEmail,
      role: staffRoleSelect,
      status: 'active'
    };

    setStaffUsers([...staffUsers, newStaff]);
    setIsStaffModalOpen(false);
    setNotification(`Successfully added staff member: ${staffName}`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleUpdateBidStatus = (bidId, newStatus) => {
    setReceivedBids(receivedBids.map(bid => {
      if (bid.id === bidId) return { ...bid, status: newStatus };
      return bid;
    }));

    const bid = receivedBids.find(b => b.id === bidId);
    setNotification(`Bid by ${bid.vendor} has been ${newStatus}.`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleUpdateVendorStatus = (vendorId, newStatus) => {
    setVendors(vendors.map(v => {
      if (v.id === vendorId) return { ...v, status: newStatus };
      return v;
    }));

    const vendor = vendors.find(v => v.id === vendorId);
    setNotification(`Vendor ${vendor.name} is now ${newStatus}.`);
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'var(--bg-secondary)',
          borderLeft: '4px solid var(--accent-company)',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 1000
        }}>
          <CheckCircle size={20} style={{ color: 'var(--accent-company)' }} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{notification}</span>
        </div>
      )}

      {/* Header Profile */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>
            Welcome Back, <span className="gradient-text-company">{user?.name || 'Enterprise'}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {userRole === 'admin' && 'ERP Management Console: Manage verified vendors and internal staff accounts.'}
            {userRole === 'manager' && 'Approver Portal: Evaluate quotation metrics and authorize pending bids.'}
            {userRole === 'officer' && 'Procurement Workspace: Publish RFP scope and compare vendor bids.'}
          </p>
        </div>

        {userRole === 'officer' && (
          <button onClick={handleOpenCreateModal} className="btn btn-company" style={{ display: 'flex', gap: '8px', padding: '12px 24px' }}>
            <Plus size={18} /> New Request (RFP)
          </button>
        )}

        {userRole === 'admin' && (
          <button onClick={() => setIsStaffModalOpen(true)} className="btn btn-company" style={{ display: 'flex', gap: '8px', padding: '12px 24px' }}>
            <UserPlus size={18} /> Add Staff Account
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-company)'
          }}>
            <Briefcase size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Active RFPs</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{rfps.length}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <FileText size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Bids Received</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>
              {receivedBids.filter(b => b.status === 'Pending').length} Pending
            </h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary)'
          }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Sourced Spend</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>$85,500</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--warning)'
          }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Approved Vendors</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>
              {vendors.filter(v => v.status === 'Approved').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', marginBottom: '40px' }}>
        
        {/* Navigation Tabs based on Role */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: '24px',
          gap: '24px'
        }}>
          {userRole !== 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('rfps')}
                style={{
                  padding: '12px 8px',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: activeTab === 'rfps' ? 'var(--accent-company)' : 'var(--text-secondary)',
                  borderBottom: '2px solid',
                  borderColor: activeTab === 'rfps' ? 'var(--accent-company)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                My Published RFPs ({rfps.length})
              </button>
              <button
                onClick={() => setActiveTab('incoming-bids')}
                style={{
                  padding: '12px 8px',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: activeTab === 'incoming-bids' ? 'var(--accent-company)' : 'var(--text-secondary)',
                  borderBottom: '2px solid',
                  borderColor: activeTab === 'incoming-bids' ? 'var(--accent-company)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Incoming Vendor Bids ({receivedBids.length})
              </button>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('vendors')}
                style={{
                  padding: '12px 8px',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: activeTab === 'vendors' ? 'var(--accent-company)' : 'var(--text-secondary)',
                  borderBottom: '2px solid',
                  borderColor: activeTab === 'vendors' ? 'var(--accent-company)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Manage Vendors ({vendors.length})
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                style={{
                  padding: '12px 8px',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: activeTab === 'staff' ? 'var(--accent-company)' : 'var(--text-secondary)',
                  borderBottom: '2px solid',
                  borderColor: activeTab === 'staff' ? 'var(--accent-company)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Manage Staff Users ({staffUsers.length})
              </button>
            </>
          )}
        </div>

        {/* Tab 1: Published RFPs */}
        {activeTab === 'rfps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {rfps.map((rfp) => (
              <div key={rfp.id} className="glass-card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{rfp.title}</h4>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <span>Budget: <strong style={{ color: 'var(--text-primary)' }}>{rfp.budget}</strong></span>
                    <span>&bull;</span>
                    <span>Received Bids: <strong style={{ color: 'var(--accent-company)' }}>{rfp.bidsCount}</strong></span>
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  color: 'var(--accent-company)'
                }}>
                  {rfp.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Incoming Vendor Bids */}
        {activeTab === 'incoming-bids' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {receivedBids.map((bid) => (
              <div key={bid.id} className="glass-card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                borderColor: bid.status === 'Accepted' ? 'rgba(16, 185, 129, 0.3)' : bid.status === 'Rejected' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-light)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--accent-company)', fontWeight: 600 }}>{bid.vendor}</span>
                    <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--text-muted)', borderRadius: '50%' }}></span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Received: {bid.date}</span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{bid.rfpTitle}</h4>
                  <p style={{ fontSize: '14px' }}>
                    Proposed Cost: <span style={{ color: 'var(--accent-company)', fontWeight: 700 }}>{bid.amount}</span>
                  </p>
                </div>

                <div>
                  {bid.status === 'Pending' ? (
                    userRole === 'manager' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleUpdateBidStatus(bid.id, 'Rejected')}
                          className="btn btn-outline"
                          style={{ padding: '8px 12px', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                        >
                          <XCircle size={16} /> Decline
                        </button>
                        <button
                          onClick={() => handleUpdateBidStatus(bid.id, 'Accepted')}
                          className="btn btn-company"
                          style={{ padding: '8px 12px' }}
                        >
                          <CheckCircle size={16} /> Accept Bid
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Pending Manager Approval
                      </span>
                    )
                  ) : (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      backgroundColor: bid.status === 'Accepted' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: bid.status === 'Accepted' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                      color: bid.status === 'Accepted' ? 'var(--success)' : 'var(--error)'
                    }}>
                      {bid.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Admin Vendor List */}
        {activeTab === 'vendors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {vendors.map((vendor) => (
              <div key={vendor.id} className="glass-card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{vendor.name}</h4>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span>Category: <strong style={{ color: 'var(--text-primary)' }}>{vendor.category}</strong></span>
                    <span>&bull;</span>
                    <span>GST: <strong style={{ color: 'var(--text-primary)' }}>{vendor.gst}</strong></span>
                  </div>
                </div>

                <div>
                  {vendor.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleUpdateVendorStatus(vendor.id, 'Rejected')}
                        className="btn btn-outline"
                        style={{ padding: '8px 12px', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleUpdateVendorStatus(vendor.id, 'Approved')}
                        className="btn btn-company"
                        style={{ padding: '8px 12px' }}
                      >
                        Approve Vendor
                      </button>
                    </div>
                  ) : (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      backgroundColor: vendor.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid',
                      borderColor: vendor.status === 'Approved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: vendor.status === 'Approved' ? 'var(--success)' : 'var(--error)'
                    }}>
                      {vendor.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Admin Staff List */}
        {activeTab === 'staff' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {staffUsers.map((staff) => (
              <div key={staff.id} className="glass-card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '2px' }}>{staff.name}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{staff.email}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-secondary)'
                  }}>
                    {staff.role}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: 'var(--success)'
                  }}>
                    {staff.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Create RFP Modal Overlay */}
      {isCreateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(6, 9, 17, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '32px',
            borderRadius: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Publish Request for Proposal (RFP)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Create a scope of work for verified vendors to submit competing quotes and proposals.
            </p>
            
            <form onSubmit={handleCreateRfp}>
              <div className="form-group">
                <label className="form-label">RFP Project Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={rfpTitle}
                  onChange={(e) => setRfpTitle(e.target.value)}
                  placeholder="e.g. Supply Chain Logistics Software"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Budget (USD)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
                  <input
                    type="number"
                    className="form-control"
                    style={{ paddingLeft: '28px' }}
                    value={rfpBudget}
                    onChange={(e) => setRfpBudget(e.target.value)}
                    placeholder="Enter maximum budget"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Scope Description</label>
                <textarea
                  className="form-control"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  value={rfpDesc}
                  onChange={(e) => setRfpDesc(e.target.value)}
                  placeholder="Provide technical requirements, key deliverables, and deadline criteria..."
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-company" style={{ padding: '10px 20px' }}>
                  Publish RFP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal Overlay */}
      {isStaffModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(6, 9, 17, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '32px',
            borderRadius: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Register Internal Staff User</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Create an operational user account tied to your shared company profile.
            </p>
            
            <form onSubmit={handleCreateStaff}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Gopal Das"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="e.g. gopal@apex.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role Privilege</label>
                <select
                  className="form-control"
                  value={staffRoleSelect}
                  onChange={(e) => setStaffRoleSelect(e.target.value)}
                >
                  <option value="officer">Procurement Officer (Creates RFQs, Compares Quotes)</option>
                  <option value="manager">Manager / Approver (Approves Bids)</option>
                  <option value="admin">System Admin (Full Admin console privilege)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setIsStaffModalOpen(false)} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-company" style={{ padding: '10px 20px' }}>
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompanyHome;
