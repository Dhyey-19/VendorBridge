import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, CheckCircle, XCircle } from 'lucide-react';

const Quotations = () => {
  const { user, token } = useAuth();
  const [quotations, setQuotations] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRfq, setSelectedRfq] = useState(''); // Default to empty instead of 'All'

  useEffect(() => {
    fetchQuotations();
    if (user.role !== 'vendor') {
      fetchRFQs();
    }
  }, [user.role]);

  const fetchQuotations = async () => {
    try {
      const res = await axios.get('/api/quotations', { headers: { Authorization: `Bearer ${token}` } });
      setQuotations(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRFQs = async () => {
    try {
      const res = await axios.get('/api/rfqs', { headers: { Authorization: `Bearer ${token}` } });
      setRfqs(res.data);
      if (res.data.length > 0) {
        setSelectedRfq(res.data[0]._id); // Select first RFQ by default
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/quotations/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      if (status === 'accepted') {
        alert('Quotation approved! An email notification has been sent to the vendor.');
      } else {
        alert('Quotation rejected.');
      }
      fetchQuotations(); // Refresh the list
    } catch (error) {
      console.error(error);
      alert('Failed to update quotation status');
    }
  };

  const [rfqFilter, setRfqFilter] = useState('All'); // All, Active, Inactive

  const filteredQuotations = quotations.filter(q => {
    if (user.role === 'vendor') return true; // Vendors see all their own
    return q.rfqId?._id === selectedRfq; // Admins only see selected RFQ
  });

  const filteredRfqsForSelect = rfqs.filter(rfq => {
    const isExpired = new Date(rfq.deadline).setHours(23, 59, 59, 999) < new Date() && rfq.status === 'active';
    const displayStatus = isExpired ? 'Expired' : rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1);
    
    if (rfqFilter === 'Active') return displayStatus === 'Active';
    if (rfqFilter === 'Inactive') return displayStatus === 'Closed' || displayStatus === 'Expired';
    return true; // All
  });

  useEffect(() => {
    if (user.role !== 'vendor') {
      if (filteredRfqsForSelect.length > 0) {
        if (!filteredRfqsForSelect.find(r => r._id === selectedRfq)) {
          setSelectedRfq(filteredRfqsForSelect[0]._id);
        }
      } else {
        setSelectedRfq('');
      }
    }
  }, [rfqFilter, rfqs]);

  // Calculate lowest price for highlighting (Admin only)
  let lowestPrice = Infinity;
  if (user.role !== 'vendor' && selectedRfq !== '') {
    filteredQuotations.forEach(q => {
      if (q.status !== 'rejected' && q.totalAmount < lowestPrice) {
        lowestPrice = q.totalAmount;
      }
    });
  }

  return (
    <div>
      {user.role !== 'vendor' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', flex: 1, alignItems: 'center' }}>
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

            <span style={{ fontWeight: 500, color: 'var(--text-muted)', marginLeft: '16px' }}>Select RFQ: </span>
            <select className="input" style={{ width: '400px' }} value={selectedRfq} onChange={(e) => setSelectedRfq(e.target.value)}>
              {filteredRfqsForSelect.length === 0 && <option value="">No RFQs matched</option>}
              {filteredRfqsForSelect.map(rfq => {
                const isExpired = new Date(rfq.deadline).setHours(23, 59, 59, 999) < new Date() && rfq.status === 'active';
                const displayStatus = isExpired ? 'Expired' : rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1);
                return (
                  <option key={rfq._id} value={rfq._id}>
                    {rfq.title} ({displayStatus})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>RFQ Title</th>
              {user.role !== 'vendor' && <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Vendor</th>}
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Price per Unit</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Total Amount</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Delivery Timeline</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Status</th>
              {user.role !== 'vendor' && <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ padding: '24px', textAlign: 'center' }}>Loading quotations...</td></tr>
            ) : filteredQuotations.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '24px', textAlign: 'center' }}>No quotations found.</td></tr>
            ) : (
              filteredQuotations.map(quote => {
                const isLowest = user.role !== 'vendor' && selectedRfq !== '' && quote.totalAmount === lowestPrice && quote.status !== 'rejected';
                return (
                  <tr key={quote._id} style={{ borderBottom: '1px solid var(--border)', background: isLowest ? '#f0fdf4' : 'transparent' }}>
                    <td style={{ padding: '16px', fontWeight: 500 }}>{quote.rfqId?.title || 'Unknown RFQ'}</td>
                    {user.role !== 'vendor' && (
                      <td style={{ padding: '16px' }}>{quote.vendorId?.name || 'Unknown Vendor'}</td>
                    )}
                    <td style={{ padding: '16px' }}>₹{quote.pricePerUnit?.toFixed(2)}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: isLowest ? 'var(--success)' : 'inherit' }}>
                      ₹{quote.totalAmount?.toFixed(2)}
                      {isLowest && <span style={{ marginLeft: '8px', fontSize: '12px', background: 'var(--success)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Lowest Bid</span>}
                    </td>
                    <td style={{ padding: '16px' }}>{quote.deliveryTimeline}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
                        background: quote.status === 'accepted' ? '#d1fae5' : quote.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                        color: quote.status === 'accepted' ? '#059669' : quote.status === 'rejected' ? '#dc2626' : '#d97706'
                      }}>
                        {quote.status.toUpperCase()}
                      </span>
                    </td>
                    {user.role !== 'vendor' && (
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {quote.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(quote._id, 'accepted')} style={{ color: 'var(--success)', background: 'none', border: 'none', cursor: 'pointer' }} title="Approve"><CheckCircle size={18} /></button>
                              <button onClick={() => updateStatus(quote._id, 'rejected')} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }} title="Reject"><XCircle size={18} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Quotations;
