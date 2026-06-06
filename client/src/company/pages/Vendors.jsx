import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Vendors.css';

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [systemVendors, setSystemVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedSystemVendors, setSelectedSystemVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (v.email && v.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const vendorCategories = Array.isArray(v.category) ? v.category : [v.category];
    const matchesCategory = !filterCategory || filterCategory === 'All Categories' || vendorCategories.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const fetchVendors = async () => {
    try {
      const [compRes, sysRes] = await Promise.all([
        fetch('/api/companies/vendors', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/companies/system-vendors', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (compRes.ok && sysRes.ok) {
        const compData = await compRes.json();
        const sysData = await sysRes.json();
        setVendors(compData);
        setSystemVendors(sysData);
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchVendors();
    }
  }, [token]);

  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    gstNumber: '',
    city: '',
    website: '',
    address: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        const res = await fetch(`/api/companies/vendors/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          fetchVendors();
        }
      } catch (error) {
        console.error("Failed to delete vendor", error);
      }
    }
  };

  const handleEditClick = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name || '',
      category: Array.isArray(vendor.category) ? vendor.category[0] : vendor.category || '',
      gstNumber: vendor.gstNumber || '',
      city: vendor.city || '',
      website: vendor.website || '',
      address: vendor.address || '',
      contactName: vendor.contactPerson?.name || '',
      contactEmail: vendor.contactPerson?.email || '',
      contactPhone: vendor.contactPerson?.phone || ''
    });
    setShowModal(true);
  };

  const handleRegisterClick = () => {
    setEditingVendor(null);
    setSelectedSystemVendors([]);
    setShowModal(true);
  };

  const handleSaveVendor = async (e) => {
    e.preventDefault();
    if (editingVendor) {
      try {
        const res = await fetch(`/api/companies/vendors/${editingVendor._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            name: formData.name,
            category: [formData.category],
            gstNumber: formData.gstNumber,
            city: formData.city,
            website: formData.website,
            address: formData.address,
            contactPerson: {
              name: formData.contactName,
              email: formData.contactEmail,
              phone: formData.contactPhone
            }
          })
        });
        if (res.ok) {
          setShowModal(false);
          fetchVendors();
        }
      } catch (error) {
        console.error("Failed to update vendor", error);
      }
    } else {
      // Registering vendor
      try {
        if (selectedSystemVendors.length === 0) {
          alert('Please select at least one vendor to register');
          return;
        }
        const res = await fetch(`/api/companies/vendors`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            vendorIds: selectedSystemVendors
          })
        });
        if (res.ok) {
          setShowModal(false);
          fetchVendors();
        }
      } catch (error) {
        console.error("Failed to register vendor", error);
      }
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2>Vendor Management</h2>
          <p className="text-muted text-sm mt-2">Manage your vendor directory, categories and details.</p>
        </div>
        <button className="btn btn-primary" onClick={handleRegisterClick}>
          <Plus size={18} />
          Register Vendor
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search vendors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-options">
            <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
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
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Category</th>
                <th>City</th>
                <th>GST No.</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">Loading vendors...</td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No vendors found.</td>
                </tr>
              ) : filteredVendors.map(vendor => (
                <tr key={vendor._id}>
                  <td className="font-medium">{vendor.name}</td>
                  <td>{Array.isArray(vendor.category) ? vendor.category.join(', ') : vendor.category || 'N/A'}</td>
                  <td>{vendor.city || 'N/A'}</td>
                  <td className="text-sm font-medium">{vendor.gstNumber || 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn text-primary" title="Edit Vendor" onClick={() => handleEditClick(vendor)}><Edit size={16} /></button>
                      <button className="icon-btn text-danger" title="Delete Vendor" onClick={() => handleDelete(vendor._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && createPortal(
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999 }}>
          <div className="modal-content animate-fade-in" style={{ display: 'flex', flexDirection: 'column', maxHeight: '90vh', width: '100%', maxWidth: '600px', margin: 'auto', overflow: 'hidden', background: 'var(--surface-color)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{editingVendor ? 'Edit Vendor' : 'Register Vendor'}</h3>
              <button className="close-btn" style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveVendor} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, margin: 0 }}>
              <div className="modal-body" style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
                {!editingVendor ? (
                  <div className="form-group mb-0">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Select Vendors from System</label>
                    <div 
                      style={{ width: '100%', maxHeight: '350px', overflowY: 'auto', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }}
                    >
                      {systemVendors.filter(v => !vendors.some(cv => cv._id === v._id)).length === 0 ? (
                        <p className="text-muted text-center py-8">No new vendors available to register.</p>
                      ) : (
                        systemVendors
                          .filter(v => !vendors.some(cv => cv._id === v._id))
                          .map(v => (
                            <label key={v._id} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', gap: '12px', transition: 'background 0.2s', ':hover': { background: 'var(--hover-bg)' } }}>
                              <input 
                                type="checkbox" 
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                checked={selectedSystemVendors.includes(v._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedSystemVendors(prev => [...prev, v._id]);
                                  } else {
                                    setSelectedSystemVendors(prev => prev.filter(id => id !== v._id));
                                  }
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 500 }}>{v.name}</div>
                                <div className="text-sm text-muted" style={{ marginTop: '4px' }}>
                                  {Array.isArray(v.category) ? v.category.join(', ') : v.category || 'No Category'} • {v.city || 'No City'}
                                </div>
                              </div>
                            </label>
                          ))
                      )}
                    </div>
                    <small className="text-muted" style={{ display: 'block', marginTop: '12px' }}>{selectedSystemVendors.length} vendor(s) selected</small>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Vendor Name</label>
                      <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Company Name" required />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Category</label>
                      <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                        <option value="">-- Select --</option>
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
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>City</label>
                      <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="e.g. Ahmedabad" />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>GST / Tax ID</label>
                      <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} value={formData.gstNumber} onChange={(e) => setFormData({...formData, gstNumber: e.target.value})} placeholder="GSTIN or Tax ID" />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Website</label>
                      <input type="url" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} placeholder="https://" />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Contact Person</label>
                      <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} value={formData.contactName} onChange={(e) => setFormData({...formData, contactName: e.target.value})} placeholder="Full Name" />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Contact Email</label>
                      <input type="email" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} value={formData.contactEmail} onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} placeholder="Email Address" />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Contact Phone</label>
                      <input type="tel" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} value={formData.contactPhone} onChange={(e) => setFormData({...formData, contactPhone: e.target.value})} placeholder="Phone Number" />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Full Address</label>
                      <textarea style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', resize: 'vertical' }} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Enter full address" rows="2"></textarea>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer flex justify-end gap-4" style={{ padding: '16px 24px', background: 'var(--surface-color)', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingVendor ? 'Save Changes' : 'Register Vendor'}</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default Vendors;
