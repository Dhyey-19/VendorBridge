import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Vendors.css';

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/companies/vendors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setVendors(data);
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
    city: ''
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
      city: vendor.city || ''
    });
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
            city: formData.city
          })
        });
        if (res.ok) {
          setShowModal(false);
          fetchVendors();
        }
      } catch (error) {
        console.error("Failed to update vendor", error);
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
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Register Vendor
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search vendors..." />
          </div>
          <div className="filter-options">
            <select className="form-select">
              <option>All Categories</option>
              <option>Hardware</option>
              <option>Software</option>
              <option>IT Services</option>
              <option>Office Supplies</option>
              <option>Consulting</option>
              <option>Logistics & Supply Chain</option>
              <option>Marketing & PR</option>
              <option>Manufacturing</option>
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
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No vendors found.</td>
                </tr>
              ) : vendors.map(vendor => (
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

      {showModal && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-content animate-fade-in" style={{ display: 'flex', flexDirection: 'column', maxHeight: '85vh', margin: 'auto', overflow: 'hidden' }}>
            <div className="modal-header">
              <h3>{editingVendor ? 'Edit Vendor' : 'Register New Vendor'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveVendor} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
              <div className="modal-body" style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label>Vendor Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Company Name" required />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
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
                    <label>City</label>
                    <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="e.g. Ahmedabad" />
                  </div>
                  <div className="form-group">
                    <label>GST / Tax ID</label>
                    <input type="text" value={formData.gstNumber} onChange={(e) => setFormData({...formData, gstNumber: e.target.value})} placeholder="GSTIN or Tax ID" />
                  </div>
                </div>
              </div>
              <div className="modal-footer flex justify-end gap-4" style={{ padding: '16px 24px', background: 'var(--surface-color)', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendors;
