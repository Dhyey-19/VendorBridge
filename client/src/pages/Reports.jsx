import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, FileText, CheckCircle } from 'lucide-react';

const Reports = () => {
  const { token, user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/invoices', { headers: { Authorization: `Bearer ${token}` } });
      setInvoices(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const totalSpend = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const pendingAmount = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const totalPaidInvoices = invoices.filter(i => i.status === 'paid').length;

  const vendorSpend = {};
  invoices.forEach(i => {
    if (i.status === 'paid') {
      const vName = i.vendorId?.name || 'Unknown Vendor';
      if (!vendorSpend[vName]) vendorSpend[vName] = 0;
      vendorSpend[vName] += (i.totalAmount || 0);
    }
  });

  const topVendors = Object.entries(vendorSpend).sort((a, b) => b[1] - a[1]);

  if (user.role === 'vendor') {
    return <div style={{ padding: '24px' }}>Reports are only available to administrators.</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Procurement Reports</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#e0e7ff', borderRadius: '12px' }}>
            <TrendingUp size={24} color="var(--primary)" />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Total Spend (Paid)</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>₹{totalSpend.toFixed(2)}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '12px' }}>
            <FileText size={24} color="#d97706" />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Pending Liabilities</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>₹{pendingAmount.toFixed(2)}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#d1fae5', borderRadius: '12px' }}>
            <CheckCircle size={24} color="#059669" />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Paid Invoices</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>{totalPaidInvoices}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Top Vendors by Spend</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Vendor Name</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Total Spend</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="2" style={{ padding: '24px', textAlign: 'center' }}>Loading reports...</td></tr>
            ) : topVendors.length === 0 ? (
              <tr><td colSpan="2" style={{ padding: '24px', textAlign: 'center' }}>No spend data available yet.</td></tr>
            ) : (
              topVendors.map(([name, amount], idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{name}</td>
                  <td style={{ padding: '16px' }}>₹{amount.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
