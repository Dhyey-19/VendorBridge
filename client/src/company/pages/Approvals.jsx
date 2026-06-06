import { useState } from 'react';
import { Check, X, Clock, FileText } from 'lucide-react';

function Approvals() {
  const [approvals] = useState([
    { id: 'APP-001', refId: 'QT-1001', type: 'Quotation', requestor: 'Jane Smith', amount: '$12,500', date: '2023-10-01', status: 'Pending' },
    { id: 'APP-002', refId: 'PO-2023-089', type: 'Purchase Order', requestor: 'Mark Johnson', amount: '$4,200', date: '2023-09-28', status: 'Approved' },
    { id: 'APP-003', refId: 'RFQ-2023-094', type: 'RFQ Release', requestor: 'Jane Smith', amount: '-', date: '2023-09-25', status: 'Rejected' },
  ]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header mb-6">
        <h2>Approval Workflow</h2>
        <p className="text-muted text-sm mt-2">Manage and track procurement approvals.</p>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Approval ID</th>
                <th>Reference</th>
                <th>Type</th>
                <th>Requestor</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map(approval => (
                <tr key={approval.id}>
                  <td className="font-medium">{approval.id}</td>
                  <td className="text-primary hover:underline cursor-pointer">{approval.refId}</td>
                  <td>{approval.type}</td>
                  <td>{approval.requestor}</td>
                  <td className="font-medium">{approval.amount}</td>
                  <td>{approval.date}</td>
                  <td>
                    <span className={`badge badge-${approval.status === 'Approved' ? 'success' : approval.status === 'Rejected' ? 'danger' : 'warning'}`}>
                      {approval.status}
                    </span>
                  </td>
                  <td>
                    {approval.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button className="btn btn-primary text-xs px-2 py-1"><Check size={14} /> Approve</button>
                        <button className="btn btn-danger text-xs px-2 py-1"><X size={14} /> Reject</button>
                      </div>
                    ) : (
                      <button className="btn btn-secondary text-xs"><FileText size={14} /> View Details</button>
                    )}
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

export default Approvals;
