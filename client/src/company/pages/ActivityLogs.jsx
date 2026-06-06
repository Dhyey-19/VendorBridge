import { useState, useEffect } from 'react';
import { History, FileQuestion, Users, CheckSquare, ShoppingCart, DollarSign, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ActivityLogs.css';

function ActivityLogs() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/companies/activities', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const mappedData = data.map((d, index) => {
            let IconComponent = History;
            if (d.icon === 'Users') IconComponent = Users;
            else if (d.icon === 'FileQuestion') IconComponent = FileQuestion;
            else if (d.icon === 'CheckSquare') IconComponent = CheckSquare;
            else if (d.icon === 'ShoppingCart') IconComponent = ShoppingCart;
            else if (d.icon === 'DollarSign') IconComponent = DollarSign;
            
            return {
              id: d._id || index,
              action: d.action,
              details: d.details,
              user: d.user,
              time: new Date(d.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              icon: IconComponent,
              color: d.color || 'primary'
            };
          });
          setLogs(mappedData);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      }
    };

    if (token) {
      fetchActivities();
    }
  }, [token]);

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
