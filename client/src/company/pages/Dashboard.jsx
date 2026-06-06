import { useState, useEffect } from 'react';
import { 
  Users, 
  FileQuestion, 
  CheckSquare, 
  ShoppingCart,
  TrendingUp,
  Clock,
  History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user, token } = useAuth();
  const [vendorsCount, setVendorsCount] = useState(0);

  useEffect(() => {
    const fetchVendorsCount = async () => {
      try {
        const res = await fetch('/api/companies/vendors', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setVendorsCount(data.length);
        }
      } catch (error) {
        console.error('Failed to fetch vendors count:', error);
      }
    };

    if (token) {
      fetchVendorsCount();
    }
  }, [token]);

  const stats = [
    { title: 'Total Vendors', value: vendorsCount.toString(), icon: Users, color: 'info' },
    { title: 'Active RFQs', value: '28', icon: FileQuestion, color: 'warning' },
    { title: 'Pending Approvals', value: '12', icon: CheckSquare, color: 'danger' },
    { title: 'Purchase Orders', value: '85', icon: ShoppingCart, color: 'success' },
  ];

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/companies/activities', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const mappedData = data.slice(0, 4).map((d, index) => {
            let IconComponent = History;
            if (d.icon === 'Users') IconComponent = Users;
            else if (d.icon === 'FileQuestion') IconComponent = FileQuestion;
            else if (d.icon === 'CheckSquare') IconComponent = CheckSquare;
            else if (d.icon === 'ShoppingCart') IconComponent = ShoppingCart;
            
            // Format time difference roughly
            const diffMs = new Date() - new Date(d.time);
            const diffMins = Math.round(diffMs / 60000);
            const diffHours = Math.round(diffMins / 60);
            const diffDays = Math.round(diffHours / 24);
            
            let timeStr = 'just now';
            if (diffDays > 0) timeStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            else if (diffHours > 0) timeStr = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            else if (diffMins > 0) timeStr = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;

            return {
              id: d._id || index,
              action: d.action,
              details: d.details,
              time: timeStr,
              icon: IconComponent
            };
          });
          setRecentActivities(mappedData);
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
    <div className="page-container">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2>Dashboard Overview</h2>
          <p className="text-muted text-sm mt-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}. Here's what's happening today.</p>
        </div>
        <button className="btn btn-primary">
          <TrendingUp size={18} />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="card stat-card">
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
            <div className={`stat-icon bg-${stat.color}-light text-${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="mb-4 text-lg font-bold">Recent Activities</h3>
          <div className="activity-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  <activity.icon size={16} />
                </div>
                <div className="activity-content">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted">{activity.details}</p>
                </div>
                <div className="activity-time flex items-center gap-2 text-sm text-muted">
                  <Clock size={14} />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 text-lg font-bold">Pending Approvals</h3>
          <div className="table-container shadow-none border-none">
            <table>
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>RFQ-092: Laptops</td>
                  <td>$12,500</td>
                  <td><span className="badge badge-warning">Pending</span></td>
                  <td><button className="text-primary hover:underline">Review</button></td>
                </tr>
                <tr>
                  <td>RFQ-091: Desks</td>
                  <td>$4,200</td>
                  <td><span className="badge badge-warning">Pending</span></td>
                  <td><button className="text-primary hover:underline">Review</button></td>
                </tr>
                <tr>
                  <td>PO-045: Servers</td>
                  <td>$28,000</td>
                  <td><span className="badge badge-danger">Urgent</span></td>
                  <td><button className="text-primary hover:underline">Review</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
