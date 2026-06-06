import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const VendorProfile = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    gstNumber: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/vendors/me', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data) {
        setFormData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    try {
      await axios.put('/api/vendors/me', formData, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>My Vendor Profile</h2>
      
      {success && <div style={{ padding: '12px', background: 'var(--success)', color: 'white', borderRadius: '6px', marginBottom: '24px' }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Company Name</label>
            <input type="text" className="input" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Category</label>
            <input type="text" className="input" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} required />
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>GST Number</label>
          <input type="text" className="input" value={formData.gstNumber || ''} onChange={e => setFormData({...formData, gstNumber: e.target.value})} required />
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-muted)' }}>Contact Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Contact Person</label>
              <input type="text" className="input" value={formData.contactName || ''} onChange={e => setFormData({...formData, contactName: e.target.value})} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Email</label>
                <input type="email" className="input" value={formData.contactEmail || ''} onChange={e => setFormData({...formData, contactEmail: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Phone</label>
                <input type="text" className="input" value={formData.contactPhone || ''} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }} disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default VendorProfile;
