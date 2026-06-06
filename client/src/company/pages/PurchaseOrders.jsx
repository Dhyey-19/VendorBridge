import { useState } from 'react';
import { Plus, Search, FileText, Download, Printer, Mail } from 'lucide-react';

function PurchaseOrders() {
  const [pos] = useState([
    { id: 'PO-2023-089', vendor: 'TechCorp Solutions', amount: '$12,500', date: '2023-10-02', status: 'Issued' },
    { id: 'PO-2023-088', vendor: 'Office Plus', amount: '$4,200', date: '2023-09-29', status: 'Completed' },
    { id: 'PO-2023-087', vendor: 'Global Logistics', amount: '$8,500', date: '2023-09-25', status: 'Pending Delivery' },
  ]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2>Purchase Orders</h2>
          <p className="text-muted text-sm mt-2">Manage generated purchase orders for approved quotes.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Create PO
        </button>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search POs..." />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pos.map(po => (
                <tr key={po.id}>
                  <td className="font-medium text-primary">{po.id}</td>
                  <td>{po.vendor}</td>
                  <td className="font-medium">{po.amount}</td>
                  <td>{po.date}</td>
                  <td>
                    <span className={`badge badge-${po.status === 'Completed' ? 'success' : po.status === 'Issued' ? 'info' : 'warning'}`}>
                      {po.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="icon-btn text-muted hover:text-primary" title="View"><FileText size={18} /></button>
                      <button className="icon-btn text-muted hover:text-primary" title="Download"><Download size={18} /></button>
                      <button className="icon-btn text-muted hover:text-primary" title="Print"><Printer size={18} /></button>
                      <button className="icon-btn text-muted hover:text-primary" title="Email"><Mail size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PurchaseOrders;
