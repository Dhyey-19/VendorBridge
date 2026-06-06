import React, { useState } from 'react';
import { Store, DollarSign, Award, Percent, ClipboardList, Send, CheckCircle } from 'lucide-react';

const VendorHome = () => {
  // Mock Data & State
  const [rfps, setRfps] = useState([
    { id: 1, title: 'Enterprise Cloud Infrastructure Migration', client: 'Global Corp', budget: '$45,000', deadline: '2026-06-25', status: 'Open' },
    { id: 2, title: 'Office Hardware Supply & Setup', client: 'Stark Industries', budget: '$12,500', deadline: '2026-07-02', status: 'Open' },
    { id: 3, title: 'AI-Based Customer Support Chatbot', client: 'Apex Retail', budget: '$28,000', deadline: '2026-06-18', status: 'Open' }
  ]);

  const [myBids, setMyBids] = useState([
    { id: 101, rfpTitle: 'Logistics Fleet Tracking App', client: 'FedEx Local', amount: '$18,500', status: 'Pending' }
  ]);

  const [activeTab, setActiveTab] = useState('open-rfps');
  const [selectedRfp, setSelectedRfp] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidProposal, setBidProposal] = useState('');
  const [notification, setNotification] = useState('');

  const handleOpenBidModal = (rfp) => {
    setSelectedRfp(rfp);
    setBidAmount(rfp.budget.replace(/[^0-9]/g, ''));
    setBidProposal('');
  };

  const handleCloseBidModal = () => {
    setSelectedRfp(null);
  };

  const handleSubmitBid = (e) => {
    e.preventDefault();
    if (!bidAmount || !bidProposal) return;

    const newBid = {
      id: Date.now(),
      rfpTitle: selectedRfp.title,
      client: selectedRfp.client,
      amount: `$${Number(bidAmount).toLocaleString()}`,
      status: 'Pending'
    };

    setMyBids([newBid, ...myBids]);
    setNotification(`Successfully submitted bid of ${newBid.amount} for ${selectedRfp.title}!`);
    handleCloseBidModal();

    setTimeout(() => {
      setNotification('');
    }, 4000);
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
          borderLeft: '4px solid var(--accent-vendor)',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 1000
        }}>
          <CheckCircle size={20} style={{ color: 'var(--accent-vendor)' }} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{notification}</span>
        </div>
      )}

      {/* Header Profile */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Welcome Back, <span className="gradient-text-vendor">Acme Supplies</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your corporate bids, browse active RFPs, and view analytics.</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          background: 'rgba(236, 72, 153, 0.05)',
          border: '1px solid rgba(236, 72, 153, 0.2)',
          borderRadius: '12px'
        }}>
          <Store size={20} style={{ color: 'var(--accent-vendor)' }} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>ID: VND-8890-AC</span>
        </div>
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
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-vendor)'
          }}>
            <ClipboardList size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Active Bids</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{myBids.length}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--success)'
          }}>
            <Award size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Won Contracts</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>12</h3>
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
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Annual Revenue</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>$214,800</h3>
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
            <Percent size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Profile Score</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>98%</h3>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: '24px',
          gap: '24px'
        }}>
          <button
            onClick={() => setActiveTab('open-rfps')}
            style={{
              padding: '12px 8px',
              fontWeight: 600,
              fontSize: '15px',
              color: activeTab === 'open-rfps' ? 'var(--accent-vendor)' : 'var(--text-secondary)',
              borderBottom: '2px solid',
              borderColor: activeTab === 'open-rfps' ? 'var(--accent-vendor)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Available RFPs ({rfps.length})
          </button>
          <button
            onClick={() => setActiveTab('my-bids')}
            style={{
              padding: '12px 8px',
              fontWeight: 600,
              fontSize: '15px',
              color: activeTab === 'my-bids' ? 'var(--accent-vendor)' : 'var(--text-secondary)',
              borderBottom: '2px solid',
              borderColor: activeTab === 'my-bids' ? 'var(--accent-vendor)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            My Submissions ({myBids.length})
          </button>
        </div>

        {activeTab === 'open-rfps' && (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--accent-vendor)', fontWeight: 600 }}>{rfp.client}</span>
                    <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--text-muted)', borderRadius: '50%' }}></span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Deadline: {rfp.deadline}</span>
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{rfp.title}</h4>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Target Budget: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rfp.budget}</span>
                  </span>
                </div>
                <button onClick={() => handleOpenBidModal(rfp)} className="btn btn-vendor" style={{ padding: '10px 20px', fontSize: '14px' }}>
                  Submit Bid <Send size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'my-bids' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {myBids.map((bid) => (
              <div key={bid.id} className="glass-card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                borderColor: 'rgba(236, 72, 153, 0.1)'
              }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{bid.rfpTitle}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Client: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{bid.client || 'Enterprise'}</span>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px', color: 'var(--accent-vendor)' }}>{bid.amount}</div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    color: 'var(--warning)'
                  }}>
                    {bid.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bid Modal Overlay */}
      {selectedRfp && (
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
            border: '1px solid rgba(236, 72, 153, 0.2)'
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Submit Proposal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              You are placing a bid for <strong style={{ color: 'var(--text-primary)' }}>{selectedRfp.title}</strong> posted by {selectedRfp.client}.
            </p>
            
            <form onSubmit={handleSubmitBid}>
              <div className="form-group">
                <label className="form-label">Bid Amount (USD)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
                  <input
                    type="number"
                    className="form-control"
                    style={{ paddingLeft: '28px' }}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Brief Proposal Description</label>
                <textarea
                  className="form-control"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  value={bidProposal}
                  onChange={(e) => setBidProposal(e.target.value)}
                  placeholder="Describe your capabilities and project timeline..."
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={handleCloseBidModal} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-vendor" style={{ padding: '10px 20px' }}>
                  Submit Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorHome;
