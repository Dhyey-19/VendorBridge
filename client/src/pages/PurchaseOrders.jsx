import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileText, Download } from 'lucide-react';

const PurchaseOrders = () => {
  const { token, user } = useAuth();
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    try {
      const res = await axios.get('/api/pos', { headers: { Authorization: `Bearer ${token}` } });
      setPos(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Purchase Orders</h1>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>PO Number</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>RFQ</th>
              {user.role !== 'vendor' && <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Vendor</th>}
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Amount</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Date Generated</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Status</th>
              {user.role === 'vendor' && <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={user.role === 'vendor' ? "6" : "6"} style={{ padding: '24px', textAlign: 'center' }}>Loading POs...</td></tr>
            ) : pos.length === 0 ? (
              <tr><td colSpan={user.role === 'vendor' ? "6" : "6"} style={{ padding: '24px', textAlign: 'center' }}>No Purchase Orders found.</td></tr>
            ) : (
              pos.map(po => (
                <tr key={po._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="var(--primary)" />
                    {po.poNumber}
                  </td>
                  <td style={{ padding: '16px' }}>{po.rfqId?.title || 'N/A'}</td>
                  {user.role !== 'vendor' && <td style={{ padding: '16px' }}>{po.vendorId?.name || 'N/A'}</td>}
                  <td style={{ padding: '16px', fontWeight: 500 }}>₹{po.totalAmount?.toFixed(2)}</td>
                  <td style={{ padding: '16px' }}>{new Date(po.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
                      background: po.status === 'sent' ? '#dbeafe' : '#d1fae5',
                      color: po.status === 'sent' ? '#2563eb' : '#059669'
                    }}>
                      {po.status.toUpperCase()}
                    </span>
                  </td>
                  {user.role === 'vendor' && (
                    <td style={{ padding: '16px' }}>
                      {po.hasInvoice ? (
                        <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: 500 }}>Invoiced</span>
                      ) : (
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={async () => {
                            try {
                              await axios.post('/api/invoices', { poId: po._id }, { headers: { Authorization: `Bearer ${token}` } });
                              alert('Invoice generated and submitted successfully!');
                              fetchPOs();
                            } catch (err) {
                              alert(err.response?.data?.message || 'Failed to submit invoice');
                            }
                          }}
                        >
                          Submit Invoice
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrders;
