import { useState } from 'react';
import { Search, Scale, FileCheck, ExternalLink } from 'lucide-react';
import './Quotations.css';

function Quotations() {
  const [quotations] = useState([
    { id: 'QT-1001', rfqId: 'RFQ-2023-092', vendor: 'TechCorp Solutions', amount: '$12,500', delivery: '14 Days', status: 'Submitted', rating: 4.8 },
    { id: 'QT-1002', rfqId: 'RFQ-2023-092', vendor: 'Prime Software', amount: '$13,200', delivery: '10 Days', status: 'Submitted', rating: 3.9 },
    { id: 'QT-1003', rfqId: 'RFQ-2023-091', vendor: 'Office Plus', amount: '$4,200', delivery: '5 Days', status: 'Approved', rating: 4.2 },
    { id: 'QT-1004', rfqId: 'RFQ-2023-091', vendor: 'Global Logistics', amount: '$4,500', delivery: '3 Days', status: 'Rejected', rating: 0 },
  ]);

  const [compareMode, setCompareMode] = useState(false);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2>Vendor Quotations</h2>
          <p className="text-muted text-sm mt-2">Review vendor submissions and compare quotes.</p>
        </div>
        <button 
          className={`btn ${compareMode ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setCompareMode(!compareMode)}
        >
          <Scale size={18} />
          {compareMode ? 'Exit Compare Mode' : 'Compare Quotations'}
        </button>
      </div>

      {compareMode ? (
        <div className="card mb-6 animate-fade-in">
          <h3 className="mb-4">Comparing Quotes for: RFQ-2023-092 (Q3 Office Laptops)</h3>
          <div className="comparison-table-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Criteria</th>
                  <th className="best-option">TechCorp Solutions <span className="badge badge-success ml-2">Lowest Price</span></th>
                  <th>Prime Software</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">Total Price</td>
                  <td className="text-success font-bold text-lg">$12,500</td>
                  <td>$13,200</td>
                </tr>
                <tr>
                  <td className="font-medium">Delivery Timeline</td>
                  <td>14 Days</td>
                  <td className="text-success font-bold text-lg">10 Days</td>
                </tr>
                <tr>
                  <td className="font-medium">Vendor Rating</td>
                  <td>★ 4.8</td>
                  <td>★ 3.9</td>
                </tr>
                <tr>
                  <td className="font-medium">Payment Terms</td>
                  <td>Net 30</td>
                  <td>Net 15</td>
                </tr>
                <tr>
                  <td className="font-medium">Action</td>
                  <td><button className="btn btn-primary w-full">Approve Quote</button></td>
                  <td><button className="btn btn-secondary w-full">Reject Quote</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="search-bar">
              <Search size={18} className="text-muted" />
              <input type="text" placeholder="Search quotations..." />
            </div>
            <div className="filter-options">
              <select className="form-select">
                <option>All RFQs</option>
                <option>RFQ-2023-092</option>
                <option>RFQ-2023-091</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Quote ID</th>
                  <th>RFQ Reference</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Delivery</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map(quote => (
                  <tr key={quote.id}>
                    <td className="font-medium text-primary">{quote.id}</td>
                    <td>{quote.rfqId}</td>
                    <td>
                      <div>{quote.vendor}</div>
                      <div className="text-xs text-muted">★ {quote.rating || 'N/A'}</div>
                    </td>
                    <td className="font-medium">{quote.amount}</td>
                    <td>{quote.delivery}</td>
                    <td>
                      <span className={`badge badge-${quote.status === 'Approved' ? 'success' : quote.status === 'Rejected' ? 'danger' : 'warning'}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-secondary text-sm">
                          <ExternalLink size={14} /> View
                        </button>
                        {quote.status === 'Submitted' && (
                          <button className="btn btn-primary text-sm">
                            <FileCheck size={14} /> Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quotations;
