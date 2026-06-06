import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import './Vendors.css';

function Vendors() {
  const [vendors, setVendors] = useState([
    { id: 'V-001', name: 'TechCorp Solutions', category: 'Hardware', contact: 'john@techcorp.com', status: 'Active', rating: 4.8 },
    { id: 'V-002', name: 'Office Plus', category: 'Supplies', contact: 'sales@officeplus.net', status: 'Active', rating: 4.2 },
    { id: 'V-003', name: 'Global Logistics', category: 'Services', contact: 'support@globallog.com', status: 'Pending', rating: 0 },
    { id: 'V-004', name: 'Prime Software', category: 'Software', contact: 'billing@primesoft.io', status: 'Inactive', rating: 3.9 },
  ]);

  const [showModal, setShowModal] = useState(false);

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
              <option>Supplies</option>
            </select>
            <select className="form-select">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Vendor ID</th>
                <th>Vendor Name</th>
                <th>Category</th>
                <th>Contact Email</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(vendor => (
                <tr key={vendor.id}>
                  <td className="font-medium">{vendor.id}</td>
                  <td>{vendor.name}</td>
                  <td>{vendor.category}</td>
                  <td>{vendor.contact}</td>
                  <td>
                    <div className="rating-indicator">
                      ★ {vendor.rating > 0 ? vendor.rating : 'N/A'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${vendor.status === 'Active' ? 'success' : vendor.status === 'Pending' ? 'warning' : 'danger'}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn text-primary"><Edit size={16} /></button>
                      <button className="icon-btn text-danger"><Trash2 size={16} /></button>
                      <button className="icon-btn"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h3>Register New Vendor</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label>Vendor Name</label>
                    <input type="text" placeholder="Company Name" />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select>
                      <option>Hardware</option>
                      <option>Software</option>
                      <option>Supplies</option>
                      <option>Services</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="contact@company.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="form-group grid-span-2" style={{ gridColumn: 'span 2' }}>
                    <label>GST / Tax ID</label>
                    <input type="text" placeholder="GSTIN or Tax ID" />
                  </div>
                  <div className="form-group grid-span-2" style={{ gridColumn: 'span 2' }}>
                    <label>Address</label>
                    <textarea placeholder="Full address" rows="3"></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer flex justify-end gap-4 mt-6">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>Save Vendor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendors;
