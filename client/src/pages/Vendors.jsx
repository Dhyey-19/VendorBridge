import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const Vendors = () => {
  const { token } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    gstNumber: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get('/api/vendors', { headers: { Authorization: `Bearer ${token}` } });
      setVendors(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/vendors', formData, { headers: { Authorization: `Bearer ${token}` } });
      setShowModal(false);
      setFormData({ name: '', category: '', gstNumber: '', contactName: '', contactEmail: '', contactPhone: '' });
      fetchVendors();
    } catch (error) {
      console.error(error);
      alert('Failed to register vendor');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/vendors/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchVendors();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || v.status === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Search vendors..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px' }} 
            />
          </div>
          <select className="input" style={{ width: '150px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Register Vendor</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Vendor Name</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Category</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>GST Number</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Contact</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center' }}>Loading vendors...</td></tr>
            ) : filteredVendors.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center' }}>No vendors found.</td></tr>
            ) : (
              filteredVendors.map(vendor => (
                <tr key={vendor._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{vendor.name}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ background: 'var(--bg)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      {vendor.category}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{vendor.gstNumber}</td>
                  <td style={{ padding: '16px' }}>
                    <div>{vendor.contactName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{vendor.contactEmail}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
                      background: vendor.status === 'approved' ? '#d1fae5' : vendor.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                      color: vendor.status === 'approved' ? '#059669' : vendor.status === 'rejected' ? '#dc2626' : '#d97706'
                    }}>
                      {vendor.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {vendor.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(vendor._id, 'approved')} style={{ color: 'var(--success)' }} title="Approve"><CheckCircle size={18} /></button>
                          <button onClick={() => updateStatus(vendor._id, 'rejected')} style={{ color: 'var(--danger)' }} title="Reject"><XCircle size={18} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Register New Vendor</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Vendor Name</label>
                  <input type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Category</label>
                  <input type="text" className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>GST Number</label>
                <input type="text" className="input" value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} required />
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '8px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-muted)' }}>Contact Person</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Name</label>
                    <input type="text" className="input" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Email</label>
                      <input type="email" className="input" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Phone</label>
                      <input type="text" className="input" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Register Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
