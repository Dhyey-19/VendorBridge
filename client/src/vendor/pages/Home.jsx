import React, { useState, useEffect } from 'react';
import { Store, DollarSign, Award, Percent, ClipboardList, Send, CheckCircle, FileText, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AnimatedCounter from '../../components/AnimatedCounter';

const VendorHome = () => {
  const { user, token } = useAuth();
  const [rfps, setRfps] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const [activeTab, setActiveTab] = useState('open-rfps');
  const [selectedRfp, setSelectedRfp] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidProposal, setBidProposal] = useState('');
  const [notification, setNotification] = useState('');

  // Theme state persisted in localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('vendor-theme') === 'dark';
  });

  // Persist theme choice
  useEffect(() => {
    localStorage.setItem('vendor-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch RFQs
        const rfqRes = await fetch('/api/vendors/rfqs', { headers });
        if (rfqRes.ok) setRfps(await rfqRes.json());

        // Fetch My Quotations
        const bidsRes = await fetch('/api/vendors/quotations', { headers });
        if (bidsRes.ok) setMyBids(await bidsRes.json());

        // Fetch Purchase Orders
        const poRes = await fetch('/api/vendors/purchase-orders', { headers });
        if (poRes.ok) setPurchaseOrders(await poRes.json());
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleOpenBidModal = (rfp) => {
    setSelectedRfp(rfp);
    setBidAmount(rfp.budget ? rfp.budget.toString() : '');
    setBidProposal('');
  };

  const handleCloseBidModal = () => {
    setSelectedRfp(null);
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    if (!bidAmount || !bidProposal) return;

    try {
      const res = await fetch('/api/vendors/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rfpId: selectedRfp._id,
          amount: Number(bidAmount),
          proposal: bidProposal
        })
      });

      if (res.ok) {
        const newBid = await res.json();
        // Optimistically add to list to avoid refetch
        setMyBids([{ 
          _id: newBid._id, 
          amount: newBid.amount, 
          status: newBid.status, 
          rfpId: { title: selectedRfp.title, client: selectedRfp.companyId?.name || selectedRfp.client } 
        }, ...myBids]);
        
        setNotification(`Successfully submitted bid of $${Number(bidAmount).toLocaleString()} for ${selectedRfp.title}!`);
        handleCloseBidModal();

        setTimeout(() => {
          setNotification('');
        }, 4000);
      }
    } catch (error) {
      console.error("Failed to submit bid:", error);
    }
  };

  const calculateRevenue = () => {
    return purchaseOrders.reduce((sum, po) => sum + (po.amount || 0), 0);
  };

  return (
    <div 
      className={`page-container slide-up-reveal ${isDarkMode ? 'dark-theme' : ''}`}
      style={isDarkMode ? { 
        backgroundColor: 'var(--bg-color)', 
        color: 'var(--text-primary)', 
        minHeight: '100vh', 
        margin: '-24px', 
        padding: '24px' 
      } : {}}
    >
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
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Welcome Back, <span className="gradient-text-vendor">{user?.name || 'Vendor'}</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your corporate bids, browse active RFPs, and view analytics.</p>
        </div>
        
        {/* Animated theme switcher */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className="btn-theme-toggle"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
        </button>
      </div>

      {/* Floating Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        {/* Active Bids Card */}
        <div 
          className="glass-card animate-float-1 delay-1" 
          style={{ display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.3s ease' }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-vendor)'
          }}>
            <ClipboardList size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Active Bids</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>
              <AnimatedCounter value={myBids.filter(b => b.status === 'Pending').length} />
            </h3>
          </div>
        </div>

        {/* Won Contracts Card */}
        <div 
          className="glass-card animate-float-2 delay-2" 
          style={{ display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.3s ease' }}
        >
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
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>
              <AnimatedCounter value={myBids.filter(b => b.status === 'Accepted').length} />
            </h3>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div 
          className="glass-card animate-float-1 delay-3" 
          style={{ display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.3s ease' }}
        >
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
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total PO Revenue</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>
              $<AnimatedCounter value={calculateRevenue()} />
            </h3>
          </div>
        </div>

        {/* Purchase Orders Card */}
        <div 
          className="glass-card animate-float-2 delay-4" 
          style={{ display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.3s ease' }}
        >
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
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Purchase Orders</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>
              <AnimatedCounter value={purchaseOrders.length} />
            </h3>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="glass-panel slide-up-reveal delay-3" style={{ padding: '32px', borderRadius: '20px', marginBottom: '40px' }}>
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
              transition: 'all 0.2s',
              background: 'none'
            }}
          >
            Available RFQs ({rfps.length})
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
              transition: 'all 0.2s',
              background: 'none'
            }}
          >
            My Submissions ({myBids.length})
          </button>
          <button
            onClick={() => setActiveTab('purchase-orders')}
            style={{
              padding: '12px 8px',
              fontWeight: 600,
              fontSize: '15px',
              color: activeTab === 'purchase-orders' ? 'var(--accent-vendor)' : 'var(--text-secondary)',
              borderBottom: '2px solid',
              borderColor: activeTab === 'purchase-orders' ? 'var(--accent-vendor)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: 'none'
            }}
          >
            Purchase Orders ({purchaseOrders.length})
          </button>
        </div>

        {activeTab === 'open-rfps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="slide-up-reveal">
            {rfps.length === 0 ? (
              <div className="text-center text-muted py-8">No open RFQs available right now.</div>
            ) : rfps.map((rfp) => (
              <div key={rfp._id} className="glass-card transition hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md p-4 rounded-xl" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--accent-vendor)', fontWeight: 600 }}>{rfp.companyId?.name || rfp.client}</span>
                    <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--text-muted)', borderRadius: '50%' }}></span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Deadline: {new Date(rfp.deadline).toLocaleDateString()}</span>
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{rfp.title}</h4>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Target Budget: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${rfp.budget.toLocaleString()}</span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="slide-up-reveal">
            {myBids.length === 0 ? (
              <div className="text-center text-muted py-8">You haven't submitted any bids yet.</div>
            ) : myBids.map((bid) => (
              <div key={bid._id} className="glass-card transition hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md p-4 rounded-xl" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{bid.rfpId?.title || 'Unknown RFQ'}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Client: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{bid.rfpId?.client || 'Enterprise'}</span>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px', color: 'var(--accent-vendor)' }}>${bid.amount.toLocaleString()}</div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: bid.status === 'Accepted' ? 'rgba(16, 185, 129, 0.1)' : bid.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid',
                    borderColor: bid.status === 'Accepted' ? 'rgba(16, 185, 129, 0.2)' : bid.status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: bid.status === 'Accepted' ? 'var(--success)' : bid.status === 'Rejected' ? 'var(--danger)' : 'var(--warning)'
                  }}>
                    {bid.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'purchase-orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="slide-up-reveal">
            {purchaseOrders.length === 0 ? (
              <div className="text-center text-muted py-8">No purchase orders received yet.</div>
            ) : purchaseOrders.map((po) => (
              <div key={po._id} className="glass-card transition hover:border-green-400 dark:hover:border-green-500 hover:shadow-md p-4 rounded-xl" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: 'var(--success)' }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>PO #: {po.poNumber}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Client: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{po.companyId?.name || 'Enterprise'}</span>
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Date: {new Date(po.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px', color: 'var(--text-primary)' }}>${po.amount.toLocaleString()}</div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: po.status === 'Fulfilled' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(6, 182, 212, 0.1)',
                    color: po.status === 'Fulfilled' ? 'var(--success)' : 'var(--secondary)'
                  }}>
                    {po.status}
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
          <div className="glass-panel slide-up-reveal" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '32px',
            borderRadius: '20px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Submit Proposal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              You are placing a bid for <strong style={{ color: 'var(--text-primary)' }}>{selectedRfp.title}</strong> posted by {selectedRfp.companyId?.name || selectedRfp.client}.
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
