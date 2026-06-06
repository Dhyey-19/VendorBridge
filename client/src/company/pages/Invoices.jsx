import { useState } from 'react';
import { Search, FileText, Download, Printer, Mail, DollarSign } from 'lucide-react';

function Invoices() {
  const [invoices] = useState([
    { id: 'INV-2023-0045', poId: 'PO-2023-088', vendor: 'Office Plus', amount: '$4,200', date: '2023-10-01', dueDate: '2023-10-31', status: 'Paid' },
    { id: 'INV-2023-0046', poId: 'PO-2023-089', vendor: 'TechCorp Solutions', amount: '$12,500', date: '2023-10-05', dueDate: '2023-11-04', status: 'Unpaid' },
  ]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2>Invoices</h2>
          <p className="text-muted text-sm mt-2">Manage generated invoices for purchase orders.</p>
        </div>
        <button className="btn btn-primary">
          <DollarSign size={18} />
          Generate Invoice
        </button>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search invoices..." />
          </div>
          <div className="filter-options">
            <select className="form-select">
              <option>All Statuses</option>
              <option>Paid</option>
              <option>Unpaid</option>
              <option>Overdue</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>PO Reference</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td className="font-medium text-primary">{invoice.id}</td>
                  <td>{invoice.poId}</td>
                  <td>{invoice.vendor}</td>
                  <td className="font-medium">{invoice.amount}</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.dueDate}</td>
                  <td>
                    <span className={`badge badge-${invoice.status === 'Paid' ? 'success' : invoice.status === 'Unpaid' ? 'warning' : 'danger'}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="icon-btn text-muted hover:text-primary" title="View"><FileText size={18} /></button>
                      <button className="icon-btn text-muted hover:text-primary" title="Download PDF"><Download size={18} /></button>
                      <button className="icon-btn text-muted hover:text-primary" title="Print"><Printer size={18} /></button>
                      <button className="icon-btn text-muted hover:text-primary" title="Email to Vendor"><Mail size={18} /></button>
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

export default Invoices;
