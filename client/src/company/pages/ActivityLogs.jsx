import { useState } from 'react';
import { History, FileQuestion, Users, CheckSquare, ShoppingCart, DollarSign, Filter } from 'lucide-react';
import './ActivityLogs.css';

function ActivityLogs() {
  const [logs] = useState([
    { id: 1, action: 'Invoice Generated', details: 'INV-2023-0046 created for PO-2023-089', user: 'System', time: 'Oct 05, 10:30 AM', icon: DollarSign, color: 'success' },
    { id: 2, action: 'PO Issued', details: 'PO-2023-089 sent to TechCorp Solutions', user: 'John Doe', time: 'Oct 02, 02:15 PM', icon: ShoppingCart, color: 'info' },
    { id: 3, action: 'Quotation Approved', details: 'QT-1001 approved by Mark Johnson', user: 'Mark Johnson', time: 'Oct 01, 11:45 AM', icon: CheckSquare, color: 'success' },
    { id: 4, action: 'Quotation Received', details: 'QT-1001 submitted by TechCorp Solutions', user: 'Vendor Portal', time: 'Sep 30, 09:20 AM', icon: Users, color: 'primary' },
    { id: 5, action: 'RFQ Created', details: 'RFQ-2023-092 published to Hardware category', user: 'John Doe', time: 'Sep 25, 10:00 AM', icon: FileQuestion, color: 'warning' },
  ]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2>Activity Logs & Notifications</h2>
          <p className="text-muted text-sm mt-2">Track all procurement activities and system events.</p>
        </div>
        <button className="btn btn-secondary">
          <Filter size={18} />
          Filter Logs
        </button>
      </div>

      <div className="card">
        <div className="timeline-container">
          {logs.map((log, index) => (
            <div key={log.id} className="timeline-item">
              <div className="timeline-marker-wrapper">
                <div className={`timeline-icon bg-${log.color}-light text-${log.color === 'primary' ? 'primary' : log.color}`}>
                  <log.icon size={16} />
                </div>
                {index < logs.length - 1 && <div className="timeline-line"></div>}
              </div>
              <div className="timeline-content">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-md">{log.action}</h4>
                    <p className="text-muted mt-1">{log.details}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-primary block">{log.time}</span>
                    <span className="text-xs text-muted block mt-1">by {log.user}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;
