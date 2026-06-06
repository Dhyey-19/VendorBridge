import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, User, Building, MapPin, CheckCircle } from 'lucide-react';

const VendorProfile = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');
  
  const [profile, setProfile] = useState({
    name: '',
    description: '',
    category: [],
    gstNumber: '',
    website: '',
    address: '',
    city: '',
    contactPerson: {
      name: '',
      phone: '',
      email: ''
    }
  });

  const [categoriesInput, setCategoriesInput] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/vendors/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || '',
            description: data.description || '',
            category: data.category || [],
            gstNumber: data.gstNumber || '',
            website: data.website || '',
            address: data.address || '',
            city: data.city || '',
            contactPerson: {
              name: data.contactPerson?.name || '',
              phone: data.contactPerson?.phone || '',
              email: data.contactPerson?.email || ''
            }
          });
          setCategoriesInput(data.category && data.category.length > 0 ? data.category[0] : '');
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('contact_')) {
      const field = name.split('_')[1];
      setProfile(prev => ({
        ...prev,
        contactPerson: {
          ...prev.contactPerson,
          [field]: value
        }
      }));
    } else if (name === 'categoriesInput') {
      setCategoriesInput(value);
      setProfile(prev => ({
        ...prev,
        category: value ? [value] : []
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/vendors/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(profile)
      });
      
      if (res.ok) {
        setNotification('Profile successfully updated!');
        setTimeout(() => setNotification(''), 4000);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading profile details...</div>;

  return (
    <div style={{ paddingBottom: '40px' }}>
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

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Vendor Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View and edit your enterprise profile details.</p>
      </div>

      <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px' }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {/* Left Column */}
            <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: 'var(--primary)' }}>
                <Building size={20} /> Company Information
              </h3>
              
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control" 
                  value={profile.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">GST / Tax ID</label>
                <input 
                  type="text" 
                  name="gstNumber" 
                  className="form-control" 
                  value={profile.gstNumber} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Category</label>
                <select 
                  name="categoriesInput" 
                  className="form-control" 
                  value={categoriesInput} 
                  onChange={handleChange} 
                >
                  <option value="">-- Select a Category --</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                  <option value="Marketing & PR">Marketing & PR</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Website</label>
                <input 
                  type="url" 
                  name="website" 
                  className="form-control" 
                  value={profile.website} 
                  onChange={handleChange} 
                  placeholder="https://"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Description</label>
                <textarea 
                  name="description" 
                  className="form-control" 
                  value={profile.description} 
                  onChange={handleChange} 
                  rows="4"
                />
              </div>
            </div>

            {/* Right Column */}
            <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: 'var(--primary)', marginTop: '0' }}>
                <User size={20} /> Contact Person
              </h3>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="contact_name" 
                  className="form-control" 
                  value={profile.contactPerson.name} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  name="contact_email" 
                  className="form-control" 
                  value={profile.contactPerson.email} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  name="contact_phone" 
                  className="form-control" 
                  value={profile.contactPerson.phone} 
                  onChange={handleChange} 
                />
              </div>

              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: 'var(--primary)', marginTop: '16px' }}>
                <MapPin size={20} /> Headquarters
              </h3>

              <div className="form-group">
                <label className="form-label">City (Gujarat)</label>
                <select 
                  name="city" 
                  className="form-control" 
                  value={profile.city} 
                  onChange={handleChange} 
                >
                  <option value="">-- Select City --</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Surat">Surat</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Rajkot">Rajkot</option>
                  <option value="Bhavnagar">Bhavnagar</option>
                  <option value="Jamnagar">Jamnagar</option>
                  <option value="Gandhinagar">Gandhinagar</option>
                  <option value="Junagadh">Junagadh</option>
                  <option value="Anand">Anand</option>
                  <option value="Navsari">Navsari</option>
                  <option value="Morbi">Morbi</option>
                  <option value="Nadiad">Nadiad</option>
                  <option value="Surendranagar">Surendranagar</option>
                  <option value="Bharuch">Bharuch</option>
                  <option value="Mehsana">Mehsana</option>
                  <option value="Bhuj">Bhuj</option>
                  <option value="Porbandar">Porbandar</option>
                  <option value="Valsad">Valsad</option>
                  <option value="Vapi">Vapi</option>
                  <option value="Godhra">Godhra</option>
                  <option value="Patan">Patan</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Full Address</label>
                <textarea 
                  name="address" 
                  className="form-control" 
                  value={profile.address} 
                  onChange={handleChange} 
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
            <button 
              type="submit" 
              className="btn btn-vendor" 
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorProfile;
