import { useState } from 'react';
import { Plus, Search, Calendar, Package, FileText } from 'lucide-react';
import './RFQs.css';

function RFQs() {
  const [rfqs, setRfqs] = useState([
    { id: 'RFQ-2023-092', title: 'Q3 Office Laptops', category: 'Hardware', deadline: '2023-10-15', status: 'Active', vendors: 4 },
    { id: 'RFQ-2023-091', title: 'Ergonomic Desks', category: 'Furniture', deadline: '2023-10-10', status: 'Closed', vendors: 2 },
    { id: 'RFQ-2023-090', title: 'Cloud Hosting Services', category: 'Software', deadline: '2023-10-25', status: 'Draft', vendors: 0 },
  ]);

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2>Request for Quotations (RFQs)</h2>
          <p className="text-muted text-sm mt-2">Manage your procurement requests and invite vendors.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Create RFQ
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search RFQs..." />
          </div>
          <div className="filter-options">
            <select className="form-select">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Closed</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        <div className="rfq-grid grid grid-cols-3 gap-6">
          {rfqs.map(rfq => (
            <div key={rfq.id} className="rfq-card border rounded-lg p-4 transition hover:shadow-md bg-white">
              <div className="flex justify-between items-start mb-3">
                <span className={`badge badge-${rfq.status === 'Active' ? 'success' : rfq.status === 'Closed' ? 'danger' : 'warning'}`}>
                  {rfq.status}
                </span>
                <span className="text-sm font-medium text-muted">{rfq.id}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{rfq.title}</h3>
              <p className="text-sm text-muted mb-4">{rfq.category}</p>
              
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-primary" />
                  <span>Deadline: <strong>{rfq.deadline}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package size={16} className="text-primary" />
                  <span>Vendors Invited: <strong>{rfq.vendors}</strong></span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-3 mt-2">
                <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                  <FileText size={14} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>Create New RFQ</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group grid-span-2" style={{ gridColumn: 'span 2' }}>
                    <label>RFQ Title</label>
                    <input type="text" placeholder="E.g., Q3 Office Laptops" />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select>
                      <option>Hardware</option>
                      <option>Software</option>
                      <option>Furniture</option>
                      <option>Services</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Submission Deadline</label>
                    <input type="date" />
                  </div>
                  
                  <div className="form-group grid-span-2" style={{ gridColumn: 'span 2' }}>
                    <label>Product/Service Details</label>
                    <textarea placeholder="Describe the requirements in detail..." rows="4"></textarea>
                  </div>

                  <div className="form-group grid-span-2" style={{ gridColumn: 'span 2' }}>
                    <h4 className="font-medium mb-2">Item List</h4>
                    <table className="items-table mb-2">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>UOM</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><input type="text" placeholder="Item" /></td>
                          <td><input type="number" placeholder="0" /></td>
                          <td>
                            <select>
                              <option>Nos</option>
                              <option>Kg</option>
                              <option>Ltr</option>
                              <option>Hrs</option>
                            </select>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button type="button" className="text-primary text-sm font-medium hover:underline">+ Add another item</button>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer flex justify-end gap-4 mt-6">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Save Draft</button>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>Publish RFQ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RFQs;
