import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileSpreadsheet } from 'lucide-react';

const Invoices = () => {
  const { token, user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get('/api/invoices', { headers: { Authorization: `Bearer ${token}` } });
      setInvoices(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Invoices</h1>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Invoice Number</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>PO Number</th>
              {user.role !== 'vendor' && <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Vendor</th>}
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Amount</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Date Submitted</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Status</th>
              {user.role !== 'vendor' && <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={user.role !== 'vendor' ? "7" : "6"} style={{ padding: '24px', textAlign: 'center' }}>Loading Invoices...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={user.role !== 'vendor' ? "7" : "6"} style={{ padding: '24px', textAlign: 'center' }}>No Invoices found.</td></tr>
            ) : (
              invoices.map(invoice => (
                <tr key={invoice._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileSpreadsheet size={18} color="var(--success)" />
                    {invoice.invoiceNumber}
                  </td>
                  <td style={{ padding: '16px' }}>{invoice.poId?.poNumber || 'N/A'}</td>
                  {user.role !== 'vendor' && <td style={{ padding: '16px' }}>{invoice.vendorId?.name || 'N/A'}</td>}
                  <td style={{ padding: '16px', fontWeight: 500 }}>₹{invoice.totalAmount?.toFixed(2)}</td>
                  <td style={{ padding: '16px' }}>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
                      background: invoice.status === 'unpaid' || invoice.status === 'pending' ? '#fef3c7' : invoice.status === 'paid' ? '#d1fae5' : '#fee2e2',
                      color: invoice.status === 'unpaid' || invoice.status === 'pending' ? '#d97706' : invoice.status === 'paid' ? '#059669' : '#dc2626'
                    }}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  {user.role !== 'vendor' && (
                    <td style={{ padding: '16px' }}>
                      {(invoice.status === 'unpaid' || invoice.status === 'pending') && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '4px 12px', fontSize: '12px' }}
                            onClick={async () => {
                              try {
                                await axios.put(`/api/invoices/${invoice._id}/status`, { status: 'paid' }, { headers: { Authorization: `Bearer ${token}` } });
                                fetchInvoices();
                              } catch (err) {
                                alert(err.response?.data?.message || 'Failed to update status');
                              }
                            }}
                          >
                            Pay
                          </button>
                        </div>
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

export default Invoices;
