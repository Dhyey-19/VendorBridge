import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Calendar } from 'lucide-react';

const RFQs = () => {
  const { user, token } = useAuth();
  const [rfqs, setRfqs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    deadline: '',
    assignedVendors: []
  });

  const [editingId, setEditingId] = useState(null);

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteRfq, setQuoteRfq] = useState(null);
  const [quoteData, setQuoteData] = useState({
    pricePerUnit: '',
    deliveryTimeline: '',
    notes: ''
  });

  useEffect(() => {
    fetchRFQs();
    if (user.role !== 'vendor') {
      fetchVendors();
    }
  }, [user.role]);

  const fetchRFQs = async () => {
    try {
      const res = await axios.get('/api/rfqs', { headers: { Authorization: `Bearer ${token}` } });
      setRfqs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await axios.get('/api/vendors', { headers: { Authorization: `Bearer ${token}` } });
      // Only approved vendors can be assigned
      setVendors(res.data.filter(v => v.status === 'approved'));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (rfq) => {
    setEditingId(rfq._id);
    setFormData({
      title: rfq.title,
      description: rfq.description,
      quantity: rfq.quantity,
      deadline: new Date(rfq.deadline).toISOString().split('T')[0],
      assignedVendors: rfq.assignedVendors.map(v => v._id)
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/rfqs/${editingId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('/api/rfqs', formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ title: '', description: '', quantity: '', deadline: '', assignedVendors: [] });
      fetchRFQs();
    } catch (error) {
      console.error(error);
      alert('Failed to save RFQ');
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalAmount = parseFloat(quoteData.pricePerUnit) * quoteRfq.quantity;
      await axios.post('/api/quotations', {
        rfqId: quoteRfq._id,
        pricePerUnit: quoteData.pricePerUnit,
        totalAmount,
        deliveryTimeline: quoteData.deliveryTimeline,
        notes: quoteData.notes
      }, { headers: { Authorization: `Bearer ${token}` } });
      setShowQuoteModal(false);
      setQuoteData({ pricePerUnit: '', deliveryTimeline: '', notes: '' });
      alert('Quotation submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to submit quotation');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this RFQ?')) return;
    try {
      await axios.delete(`/api/rfqs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchRFQs();
    } catch (error) {
      console.error(error);
      alert('Failed to delete RFQ');
    }
  };

  const [rfqFilter, setRfqFilter] = useState('All'); // All, Active, Inactive

  const filteredRfqs = rfqs.filter(r => {
    const isExpired = new Date(r.deadline).setHours(23, 59, 59, 999) < new Date() && r.status === 'active';
    const displayStatus = isExpired ? 'expired' : r.status;
    
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (rfqFilter === 'Active') return displayStatus === 'active';
    if (rfqFilter === 'Inactive') return displayStatus === 'closed' || displayStatus === 'expired';
    return true; // All
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flex: 1, alignItems: 'center' }}>
          <div className="search-bar" style={{ maxWidth: '400px' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search RFQs..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', background: 'var(--surface)', padding: '4px', borderRadius: '6px', border: '1px solid var(--border)' }}>
            {['All', 'Active', 'Inactive'].map(tab => (
              <button 
                key={tab}
                onClick={() => setRfqFilter(tab)}
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '4px', 
                  fontSize: '14px',
                  fontWeight: 500,
                  background: rfqFilter === tab ? 'var(--primary)' : 'transparent',
                  color: rfqFilter === tab ? 'white' : 'var(--text-muted)'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        {user.role !== 'vendor' && (
          <button className="btn btn-primary" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', quantity: '', deadline: '', assignedVendors: [] }); setShowModal(true); }}>
            + Create RFQ
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Title & Description</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Quantity</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Deadline</th>
              {user.role !== 'vendor' && <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Assigned To</th>}
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center' }}>Loading RFQs...</td></tr>
            ) : filteredRfqs.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No RFQs found.</td></tr>
            ) : (
              filteredRfqs.map(rfq => {
                const isExpired = new Date(rfq.deadline).setHours(23, 59, 59, 999) < new Date() && rfq.status === 'active';
                const displayStatus = isExpired ? 'expired' : rfq.status;

                return (
                  <tr key={rfq._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px' }}>
                      <h3 style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{rfq.title}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rfq.description}</p>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500 }}>{rfq.quantity}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500, color: isExpired ? 'var(--danger)' : 'inherit' }}>
                          {new Date(rfq.deadline).toLocaleDateString()}
                        </span>
                        {displayStatus === 'active' && (
                          <span style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '2px', fontWeight: 600 }}>
                            {(() => {
                              const diffTime = new Date(rfq.deadline).setHours(23, 59, 59, 999) - new Date();
                              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                              const diffHours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
                              return `Expires in ${diffDays}d ${diffHours}h`;
                            })()}
                          </span>
                        )}
                      </div>
                    </td>
                    {user.role !== 'vendor' && (
                      <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
                        {rfq.assignedVendors?.length > 0 
                          ? `${rfq.assignedVendors.length} Vendor${rfq.assignedVendors.length > 1 ? 's' : ''}`
                          : 'All Vendors'}
                      </td>
                    )}
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
                        background: displayStatus === 'active' ? '#d1fae5' : displayStatus === 'expired' ? '#fee2e2' : '#f3f4f6',
                        color: displayStatus === 'active' ? '#059669' : displayStatus === 'expired' ? '#dc2626' : '#4b5563'
                      }}>
                        {displayStatus.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {user.role !== 'vendor' && (
                          <>
                            <button onClick={() => handleEditClick(rfq)} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Edit</button>
                            <button onClick={() => handleDelete(rfq._id)} style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Delete</button>
                          </>
                        )}
                        {user.role === 'vendor' && displayStatus === 'active' && (
                          <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '13px' }} onClick={() => {setQuoteRfq(rfq); setShowQuoteModal(true);}}>
                            Quote
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>{editingId ? 'Edit RFQ' : 'Create New RFQ'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>RFQ Title</label>
                <input type="text" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Product / Service Details</label>
                <textarea className="input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Quantity</label>
                  <input type="number" className="input" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Deadline</label>
                  <input type="date" className="input" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Assign Vendors</label>
                <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '6px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {vendors.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No approved vendors available.</div>
                  ) : vendors.map(v => (
                    <label key={v._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.assignedVendors.includes(v._id)}
                        onChange={(e) => {
                          const newAssigned = e.target.checked 
                            ? [...formData.assignedVendors, v._id]
                            : formData.assignedVendors.filter(id => id !== v._id);
                          setFormData({ ...formData, assignedVendors: newAssigned });
                        }}
                      />
                      {v.name} <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>({v.category})</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create RFQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQuoteModal && quoteRfq && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Submit Quotation</h2>
            <div style={{ marginBottom: '16px', padding: '12px', background: '#f3f4f6', borderRadius: '6px', fontSize: '14px' }}>
              <strong>RFQ:</strong> {quoteRfq.title} <br/>
              <strong>Requested Qty:</strong> {quoteRfq.quantity}
            </div>
            <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Price per Unit (₹)</label>
                  <input type="number" step="0.01" className="input" value={quoteData.pricePerUnit} onChange={e => setQuoteData({...quoteData, pricePerUnit: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Total Amount (₹)</label>
                  <input type="number" className="input" value={(quoteData.pricePerUnit * quoteRfq.quantity).toFixed(2)} readOnly style={{ background: '#f9fafb' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Delivery Timeline (e.g., 2 Weeks)</label>
                <input type="text" className="input" value={quoteData.deliveryTimeline} onChange={e => setQuoteData({...quoteData, deliveryTimeline: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Additional Notes</label>
                <textarea className="input" rows="2" value={quoteData.notes} onChange={e => setQuoteData({...quoteData, notes: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowQuoteModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Quote</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFQs;
