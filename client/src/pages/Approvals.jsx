import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, PackagePlus } from 'lucide-react';

const Approvals = () => {
  const { token, user } = useAuth();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const res = await axios.get('/api/quotations', { headers: { Authorization: `Bearer ${token}` } });
      // Only show accepted quotations in the approvals menu
      setQuotations(res.data.filter(q => q.status === 'accepted'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePO = async (quotationId) => {
    try {
      const res = await axios.post('/api/pos', { quotationId }, { headers: { Authorization: `Bearer ${token}` } });
      alert(`Purchase Order ${res.data.poNumber} generated successfully!`);
      fetchApprovals(); // Refresh to update the PO status flag
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to generate Purchase Order');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Approved Quotations</h1>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>RFQ Title</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Vendor</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Total Amount</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Delivery Timeline</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center' }}>Loading approvals...</td></tr>
            ) : quotations.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center' }}>No approved quotations found.</td></tr>
            ) : (
              quotations.map(quote => (
                <tr key={quote._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckSquare size={18} color="var(--success)" />
                    {quote.rfqId?.title || 'Unknown RFQ'}
                  </td>
                  <td style={{ padding: '16px' }}>{quote.vendorId?.name || 'Unknown Vendor'}</td>
                  <td style={{ padding: '16px', fontWeight: 600 }}>₹{quote.totalAmount?.toFixed(2)}</td>
                  <td style={{ padding: '16px' }}>{quote.deliveryTimeline}</td>
                  <td style={{ padding: '16px' }}>
                    {quote.hasPO ? (
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
                        background: '#d1fae5', color: '#059669'
                      }}>
                        PO Generated
                      </span>
                    ) : (
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}
                        onClick={() => handleGeneratePO(quote._id)}
                      >
                        <PackagePlus size={14} />
                        Generate PO
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Approvals;
