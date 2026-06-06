import { useState, useEffect } from 'react';
import { 
  Plus, Search, Calendar, Package, FileText, Trash2, Edit2, 
  Check, X, UserPlus, UserMinus, DollarSign, ListTodo 
} from 'lucide-react';
import './RFQs.css';

function RFQs() {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Hardware');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newItems, setNewItems] = useState([{ name: '', quantity: 1, uom: 'Nos' }]);

  // Details / Edit Modal State
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Hardware');
  const [editDeadline, setEditDeadline] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editItems, setEditItems] = useState([]);
  const [editStatus, setEditStatus] = useState('Active');

  // All vendors list (for invitations)
  const [allVendors, setAllVendors] = useState([]);
  const [selectedVendorToInvite, setSelectedVendorToInvite] = useState('');

  // Fetch RFQs and Vendors on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Session expired. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      // Fetch RFQs
      const rfqRes = await fetch('/api/companies/rfqs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!rfqRes.ok) throw new Error('Failed to fetch RFQs');
      const rfqData = await rfqRes.json();
      setRfqs(rfqData);

      // Fetch Vendors
      const vendorRes = await fetch('/api/companies/vendors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (vendorRes.ok) {
        const vendorData = await vendorRes.json();
        // Filter approved vendors only
        setAllVendors(vendorData.filter(v => v.status === 'Approved'));
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single RFQ details (to sync/refresh details view)
  const refreshSingleRFQ = async (rfqId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/companies/rfqs/${rfqId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const updatedRfq = await res.json();
        setSelectedRfq(updatedRfq);
        // Also update in list
        setRfqs(prev => prev.map(r => r._id === rfqId ? updatedRfq : r));
      }
    } catch (err) {
      console.error('Failed to refresh RFQ details:', err);
    }
  };

  // Create RFQ Handlers
  const handleAddCreateItem = () => {
    setNewItems([...newItems, { name: '', quantity: 1, uom: 'Nos' }]);
  };

  const handleRemoveCreateItem = (index) => {
    setNewItems(newItems.filter((_, i) => i !== index));
  };

  const handleCreateItemChange = (index, field, value) => {
    const updated = [...newItems];
    updated[index][field] = value;
    setNewItems(updated);
  };

  const handleCreateRFQ = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDeadline) {
      alert('Please provide an RFQ title and submission deadline.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const filteredItems = newItems.filter(item => item.name.trim() !== '');
      const payload = {
        title: newTitle,
        category: newCategory,
        deadline: newDeadline,
        description: newDescription,
        budget: Number(newBudget) || 0,
        items: filteredItems,
        status: 'Active'
      };

      const res = await fetch('/api/companies/rfqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create RFQ');
      }

      // Reset Create form
      setNewTitle('');
      setNewCategory('Hardware');
      setNewDeadline('');
      setNewDescription('');
      setNewBudget('');
      setNewItems([{ name: '', quantity: 1, uom: 'Nos' }]);
      setShowCreateModal(false);

      // Refresh list
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete RFQ Handler
  const handleDeleteRFQ = async (rfqId) => {
    if (!window.confirm('Are you sure you want to delete this RFQ? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/companies/rfqs/${rfqId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete RFQ');
      }

      setSelectedRfq(null);
      setIsEditMode(false);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit Mode Toggle and Handlers
  const handleOpenEdit = () => {
    if (!selectedRfq) return;
    setEditTitle(selectedRfq.title);
    setEditCategory(selectedRfq.category || 'Hardware');
    // Format date string for HTML input (YYYY-MM-DD)
    const formattedDate = selectedRfq.deadline ? selectedRfq.deadline.split('T')[0] : '';
    setEditDeadline(formattedDate);
    setEditDescription(selectedRfq.description || '');
    setEditBudget(selectedRfq.budget || '');
    setEditItems(selectedRfq.items || []);
    setEditStatus(selectedRfq.status || 'Active');
    setIsEditMode(true);
  };

  const handleAddEditItem = () => {
    setEditItems([...editItems, { name: '', quantity: 1, uom: 'Nos' }]);
  };

  const handleRemoveEditItem = (index) => {
    setEditItems(editItems.filter((_, i) => i !== index));
  };

  const handleEditItemChange = (index, field, value) => {
    const updated = [...editItems];
    updated[index][field] = value;
    setEditItems(updated);
  };

  const handleUpdateRFQ = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDeadline) {
      alert('Please provide an RFQ title and submission deadline.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const filteredItems = editItems.filter(item => item.name.trim() !== '');
      const payload = {
        title: editTitle,
        category: editCategory,
        deadline: editDeadline,
        description: editDescription,
        budget: Number(editBudget) || 0,
        items: filteredItems,
        status: editStatus
      };

      const res = await fetch(`/api/companies/rfqs/${selectedRfq._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update RFQ');
      }

      setIsEditMode(false);
      refreshSingleRFQ(selectedRfq._id);
    } catch (err) {
      alert(err.message);
    }
  };

  // Vendor Assignment Handlers
  const handleInviteVendor = async () => {
    if (!selectedVendorToInvite) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/companies/rfqs/${selectedRfq._id}/vendors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ vendorId: selectedVendorToInvite })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to invite vendor');
      }

      setSelectedVendorToInvite('');
      refreshSingleRFQ(selectedRfq._id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveVendor = async (vendorId) => {
    if (!window.confirm('Are you sure you want to remove this vendor from the invited list?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/companies/rfqs/${selectedRfq._id}/vendors/${vendorId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to remove vendor');
      }

      refreshSingleRFQ(selectedRfq._id);
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter RFQs based on search query and status filter
  const filteredRfqs = rfqs.filter(rfq => {
    const matchesSearch = rfq.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (rfq.category && rfq.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (rfq._id && rfq._id.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (statusFilter === 'All Statuses') return matchesSearch;
    return matchesSearch && rfq.status === statusFilter;
  });

  // Get list of vendors that are approved but NOT yet invited to the selected RFQ
  const getInvitableVendors = () => {
    if (!selectedRfq || !selectedRfq.invitedVendors) return [];
    const invitedIds = selectedRfq.invitedVendors.map(v => v._id);
    return allVendors.filter(v => !invitedIds.includes(v._id));
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2>Request for Quotations (RFQs)</h2>
          <p className="text-muted text-sm mt-2">Manage your procurement requests and invite vendors dynamically.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Create RFQ
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button className="close-btn" onClick={() => setError(null)}>&times;</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted">Loading Request for Quotations...</p>
        </div>
      ) : (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="search-bar">
              <Search size={18} className="text-muted" />
              <input 
                type="text" 
                placeholder="Search RFQs by title, category, or ref..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-options">
              <select 
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Closed</option>
                <option>Awarded</option>
              </select>
            </div>
          </div>

          {filteredRfqs.length === 0 ? (
            <div className="text-center py-12 text-muted">
              No Request for Quotations found matching your criteria.
            </div>
          ) : (
            <div className="rfq-grid">
              {filteredRfqs.map(rfq => (
                <div key={rfq._id} className="rfq-card border rounded-lg p-4 transition hover:shadow-md bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`badge badge-${
                      rfq.status === 'Active' || rfq.status === 'Open' ? 'success' : 
                      rfq.status === 'Closed' ? 'danger' : 
                      rfq.status === 'Draft' ? 'warning' : 'primary'
                    }`}>
                      {rfq.status}
                    </span>
                    <span className="text-xs font-semibold text-muted" title={rfq._id}>
                      REF-{rfq._id.substring(rfq._id.length - 6).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1 line-clamp-1" title={rfq.title}>{rfq.title}</h3>
                  <p className="text-xs font-medium text-primary bg-indigo-50 px-2 py-0.5 rounded inline-block mb-4">
                    {rfq.category || 'Hardware'}
                  </p>
                  
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-gray-400" />
                      <span>Deadline: <strong>{rfq.deadline ? new Date(rfq.deadline).toLocaleDateString() : 'N/A'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package size={16} className="text-gray-400" />
                      <span>Vendors Invited: <strong>{rfq.invitedVendors?.length || 0}</strong></span>
                    </div>
                    {rfq.budget > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign size={16} className="text-gray-400" />
                        <span>Budget: <strong>${rfq.budget.toLocaleString()}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center border-t pt-3 mt-2">
                    <button 
                      onClick={() => {
                        setSelectedRfq(rfq);
                        setIsEditMode(false);
                      }} 
                      className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      <FileText size={14} />
                      View Details & Vendors
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>Create New RFQ</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateRFQ}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>RFQ Title *</label>
                    <input 
                      type="text" 
                      placeholder="E.g., Q3 Office Laptops" 
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                      <option>Hardware</option>
                      <option>Software</option>
                      <option>Furniture</option>
                      <option>Services</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Submission Deadline *</label>
                    <input 
                      type="date" 
                      required
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Approximate Budget ($)</label>
                    <input 
                      type="number" 
                      placeholder="E.g., 15000 (Optional)" 
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Product/Service Details</label>
                    <textarea 
                      placeholder="Describe the requirements in detail..." 
                      rows="3"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    ></textarea>
                  </div>

                  {/* ITEM LIST */}
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-sm flex items-center gap-1 text-gray-700">
                        <ListTodo size={16} />
                        Item List
                      </h4>
                      <button 
                        type="button" 
                        onClick={handleAddCreateItem}
                        className="text-primary text-xs font-semibold hover:underline"
                      >
                        + Add Item
                      </button>
                    </div>
                    <table className="items-table mb-2">
                      <thead>
                        <tr>
                          <th style={{ width: '50%' }}>Item Name</th>
                          <th style={{ width: '20%' }}>Quantity</th>
                          <th style={{ width: '20%' }}>UOM</th>
                          <th style={{ width: '10%' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newItems.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <input 
                                type="text" 
                                placeholder="Item" 
                                required
                                value={item.name}
                                onChange={(e) => handleCreateItemChange(idx, 'name', e.target.value)}
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                min="1" 
                                required
                                value={item.quantity}
                                onChange={(e) => handleCreateItemChange(idx, 'quantity', Number(e.target.value))}
                              />
                            </td>
                            <td>
                              <select 
                                value={item.uom} 
                                onChange={(e) => handleCreateItemChange(idx, 'uom', e.target.value)}
                              >
                                <option>Nos</option>
                                <option>Kg</option>
                                <option>Ltr</option>
                                <option>Hrs</option>
                              </select>
                            </td>
                            <td>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveCreateItem(idx)}
                                disabled={newItems.length === 1}
                                className="text-danger hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="modal-footer flex justify-end gap-4 mt-6">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Publish RFQ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS & VENDOR MANAGEMENT MODAL */}
      {selectedRfq && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <h3>{isEditMode ? 'Edit RFQ Details' : 'RFQ Details'}</h3>
                {!isEditMode && (
                  <span className={`badge badge-${
                    selectedRfq.status === 'Active' || selectedRfq.status === 'Open' ? 'success' : 
                    selectedRfq.status === 'Closed' ? 'danger' : 'warning'
                  }`}>
                    {selectedRfq.status}
                  </span>
                )}
              </div>
              <button 
                className="close-btn" 
                onClick={() => {
                  setSelectedRfq(null);
                  setIsEditMode(false);
                }}
              >&times;</button>
            </div>
            
            <div className="modal-body">
              {isEditMode ? (
                /* EDIT MODE FORM */
                <form onSubmit={handleUpdateRFQ}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>RFQ Title *</label>
                      <input 
                        type="text" 
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                        <option>Hardware</option>
                        <option>Software</option>
                        <option>Furniture</option>
                        <option>Services</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Submission Deadline *</label>
                      <input 
                        type="date" 
                        required
                        value={editDeadline}
                        onChange={(e) => setEditDeadline(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Approximate Budget ($)</label>
                      <input 
                        type="number" 
                        value={editBudget}
                        onChange={(e) => setEditBudget(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>RFQ Status</label>
                      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                        <option value="Active">Active / Open</option>
                        <option value="Draft">Draft</option>
                        <option value="Closed">Closed</option>
                        <option value="Awarded">Awarded</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Product/Service Details</label>
                      <textarea 
                        rows="3"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      ></textarea>
                    </div>

                    {/* EDIT LINE ITEMS */}
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-sm text-gray-700">Line Items</h4>
                        <button 
                          type="button" 
                          onClick={handleAddEditItem}
                          className="text-primary text-xs font-semibold hover:underline"
                        >
                          + Add Item
                        </button>
                      </div>
                      <table className="items-table mb-2">
                        <thead>
                          <tr>
                            <th style={{ width: '50%' }}>Item Name</th>
                            <th style={{ width: '20%' }}>Quantity</th>
                            <th style={{ width: '20%' }}>UOM</th>
                            <th style={{ width: '10%' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editItems.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <input 
                                  type="text" 
                                  required
                                  value={item.name}
                                  onChange={(e) => handleEditItemChange(idx, 'name', e.target.value)}
                                />
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  min="1" 
                                  required
                                  value={item.quantity}
                                  onChange={(e) => handleEditItemChange(idx, 'quantity', Number(e.target.value))}
                                />
                              </td>
                              <td>
                                <select 
                                  value={item.uom} 
                                  onChange={(e) => handleEditItemChange(idx, 'uom', e.target.value)}
                                >
                                  <option>Nos</option>
                                  <option>Kg</option>
                                  <option>Ltr</option>
                                  <option>Hrs</option>
                                </select>
                              </td>
                              <td>
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveEditItem(idx)}
                                  disabled={editItems.length === 1}
                                  className="text-danger hover:text-red-700 disabled:opacity-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="modal-footer flex justify-between items-center mt-6">
                    <button 
                      type="button" 
                      className="btn btn-danger flex items-center gap-1"
                      onClick={() => handleDeleteRFQ(selectedRfq._id)}
                    >
                      <Trash2 size={16} />
                      Delete RFQ
                    </button>
                    <div className="flex gap-4">
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setIsEditMode(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* READ & MANAGE VENDORS VIEW */
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
                    <div>
                      <span className="text-xs font-semibold text-muted uppercase block">RFQ Reference</span>
                      <strong className="text-gray-800">{selectedRfq._id}</strong>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted uppercase block">Category</span>
                      <strong className="text-gray-800">{selectedRfq.category || 'Hardware'}</strong>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted uppercase block">Submission Deadline</span>
                      <strong className="text-gray-800">{selectedRfq.deadline ? new Date(selectedRfq.deadline).toLocaleDateString() : 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted uppercase block">Budget</span>
                      <strong className="text-gray-800">{selectedRfq.budget > 0 ? `$${selectedRfq.budget.toLocaleString()}` : 'Not Specified'}</strong>
                    </div>
                    <div style={{ gridColumn: 'span 2' }} className="mt-2">
                      <span className="text-xs font-semibold text-muted uppercase block">Requirements Description</span>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-line bg-gray-50 p-3 rounded-lg border">
                        {selectedRfq.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>

                  {/* ITEM LIST VIEW */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm mb-2 text-gray-800">RFQ Requested Items</h4>
                    {selectedRfq.items && selectedRfq.items.length > 0 ? (
                      <table className="items-table bg-gray-50 rounded">
                        <thead>
                          <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>UOM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRfq.items.map((item, idx) => (
                            <tr key={item._id || idx}>
                              <td><strong>{item.name}</strong></td>
                              <td>{item.quantity}</td>
                              <td>{item.uom}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-sm text-muted">No specific item lines added to this RFQ.</p>
                    )}
                  </div>

                  {/* VENDOR MANAGEMENT SECTION */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-bold text-base text-gray-800">Invited Vendors ({selectedRfq.invitedVendors?.length || 0})</h4>
                        <p className="text-xs text-muted">Invite or remove vendors who are allowed to place bids on this RFQ.</p>
                      </div>
                      
                      {/* Invite Vendor Action */}
                      {getInvitableVendors().length > 0 ? (
                        <div className="flex gap-2 items-center">
                          <select 
                            className="form-select text-sm p-1.5"
                            style={{ width: '200px' }}
                            value={selectedVendorToInvite}
                            onChange={(e) => setSelectedVendorToInvite(e.target.value)}
                          >
                            <option value="">Select Vendor to Invite...</option>
                            {getInvitableVendors().map(vendor => (
                              <option key={vendor._id} value={vendor._id}>
                                {vendor.name} ({vendor.rating} ★)
                              </option>
                            ))}
                          </select>
                          <button 
                            onClick={handleInviteVendor}
                            disabled={!selectedVendorToInvite}
                            className="btn btn-primary btn-sm flex items-center gap-1 py-1.5"
                          >
                            <UserPlus size={14} />
                            Invite
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted italic">All approved vendors invited</span>
                      )}
                    </div>

                    {/* Invited Vendors List */}
                    {!selectedRfq.invitedVendors || selectedRfq.invitedVendors.length === 0 ? (
                      <div className="bg-gray-50 border border-dashed rounded-lg p-6 text-center text-muted text-sm">
                        No vendors have been invited to this RFQ yet. Select a vendor above to invite them.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {selectedRfq.invitedVendors.map(vendor => (
                          <div key={vendor._id} className="flex items-center justify-between border rounded-lg p-3 bg-white hover:border-indigo-200 transition">
                            <div className="flex items-center gap-3">
                              {vendor.logo ? (
                                <img src={vendor.logo} alt={vendor.name} className="w-10 h-10 rounded-full border object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                  {vendor.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <h5 className="font-semibold text-sm text-gray-800">{vendor.name}</h5>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-muted">{vendor.city || 'No City'}</span>
                                  <span className="text-xs text-amber-500">★ {vendor.rating}</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleRemoveVendor(vendor._id)}
                              className="text-danger hover:text-red-700 p-1"
                              title="Remove vendor"
                            >
                              <UserMinus size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="modal-footer flex justify-between border-t pt-4 mt-6">
                    <button 
                      className="btn btn-danger flex items-center gap-1"
                      onClick={() => handleDeleteRFQ(selectedRfq._id)}
                    >
                      <Trash2 size={16} />
                      Delete RFQ
                    </button>
                    <div className="flex gap-4">
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => setSelectedRfq(null)}
                      >
                        Close
                      </button>
                      <button 
                        className="btn btn-primary flex items-center gap-1"
                        onClick={handleOpenEdit}
                      >
                        <Edit2 size={16} />
                        Edit RFQ Details
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RFQs;
