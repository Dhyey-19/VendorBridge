import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  Plus, 
  Search, 
  Shield, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import './TeamManagement.css';

function TeamManagement() {
  const { token, user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Roster States
  const [teamList, setTeamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'officer'
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Fetch Team Roster
  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/companies/team', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch team roster');
      }
      setTeamList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTeam();
    }
  }, [token]);

  // Handle Toast Trigger
  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Toggle user status between active and inactive
  const handleToggleStatus = async (memberId, currentStatus) => {
    if (!isAdmin) return;
    
    const newStatus = (currentStatus === 'active' || currentStatus === 'pending') ? 'inactive' : 'active';
    
    try {
      const res = await fetch(`/api/companies/team/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update member status');
      }
      
      // Update local state
      setTeamList(teamList.map(m => m._id === memberId ? { ...m, status: newStatus } : m));
      triggerToast(`Successfully ${newStatus === 'active' ? 'reactivated' : 'deactivated'} ${data.name}.`);
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form submit handler to create new team member
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setFormSubmitting(true);
    setFormError('');

    try {
      const res = await fetch('/api/companies/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add team member');
      }

      setTeamList(prev => [...prev, data]);
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'officer' });
      triggerToast(`Staff account created successfully for ${data.name}!`);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filtered Roster list based on search query
  const filteredRoster = teamList.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Roster Statistics
  const totalMembers = teamList.length;
  const adminCount = teamList.filter(m => m.role === 'admin').length;
  const managerCount = teamList.filter(m => m.role === 'manager').length;
  const officerCount = teamList.filter(m => m.role === 'officer').length;

  return (
    <div className="page-container">
      {/* Toast popup */}
      {toast.show && (
        <div className="toast-notification" style={{
          borderLeftColor: toast.type === 'success' ? 'var(--success)' : 'var(--error)'
        }}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
          ) : (
            <AlertCircle size={20} style={{ color: 'var(--error)' }} />
          )}
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2>Team Roster & Roles</h2>
          <p className="text-muted text-sm mt-2">
            View internal staff permissions, active company operators, and security roles.
          </p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Register Team Member
          </button>
        )}
      </div>

      {error && (
        <div className="card mb-6 bg-danger-light text-danger flex items-center gap-3">
          <ShieldAlert size={20} />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Roster Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)' }}>
            <Users size={22} />
          </div>
          <div>
            <p className="text-muted text-sm" style={{ marginBottom: '2px' }}>Total Staff</p>
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{loading ? '...' : totalMembers}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }}>
            <Shield size={22} />
          </div>
          <div>
            <p className="text-muted text-sm" style={{ marginBottom: '2px' }}>Administrators</p>
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{loading ? '...' : adminCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary-hover)' }}>
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-muted text-sm" style={{ marginBottom: '2px' }}>Managers</p>
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{loading ? '...' : managerCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--info-color)' }}>
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-muted text-sm" style={{ marginBottom: '2px' }}>Procurement Officers</p>
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{loading ? '...' : officerCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Roster Card */}
      <div className="card mb-6">
        <div className="team-actions mb-4">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search team members by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted">
            Showing {filteredRoster.length} of {totalMembers} members
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="p-6 text-center text-muted text-sm">
              Loading team directory data...
            </div>
          ) : filteredRoster.length === 0 ? (
            <div className="p-6 text-center text-muted text-sm">
              No staff members found matching your search.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Email Address</th>
                  <th>Privilege Role</th>
                  <th>Status</th>
                  {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRoster.map(member => (
                  <tr key={member._id}>
                    <td>
                      <div className="font-bold">{member.name}</div>
                    </td>
                    <td>{member.email}</td>
                    <td>
                      <span className={`badge ${
                        member.role === 'admin' ? 'badge-danger' : 
                        member.role === 'manager' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {member.role === 'admin' ? 'Administrator' : 
                         member.role === 'manager' ? 'Manager' : 'Procurement Officer'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${
                        member.status === 'active' ? 'success' : 
                        member.status === 'pending' ? 'warning' : 'danger'
                      }`}>
                        {member.status === 'active' ? 'Active' : 
                         member.status === 'pending' ? 'Pending' : 'Inactive'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        {member._id === user?._id ? (
                          <span className="text-xs text-muted font-medium italic">
                            Logged-in Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(member._id, member.status)}
                            className={`btn ${member.status === 'active' || member.status === 'pending' ? 'btn-secondary' : 'btn-primary'}`}
                            style={{ 
                              padding: '0.35rem 0.75rem', 
                              fontSize: '0.75rem',
                              color: member.status === 'active' || member.status === 'pending' ? 'var(--danger-color)' : 'white',
                              borderColor: member.status === 'active' || member.status === 'pending' ? 'var(--danger-color)' : 'transparent',
                              backgroundColor: member.status === 'active' || member.status === 'pending' ? 'transparent' : 'var(--success-color)'
                            }}
                          >
                            {member.status === 'active' || member.status === 'pending' ? (
                              <>
                                <UserX size={12} />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck size={12} />
                                Reactivate
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Staff Modal Overlay */}
      {showAddModal && isAdmin && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register Internal Staff User</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {formError && (
                <div className="form-group bg-danger-light text-danger p-3 rounded" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={16} />
                  <span>{formError}</span>
                </div>
              )}
              <form onSubmit={handleAddMember}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Sarah Smith"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. sarah.s@company.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Temporary Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password for initial login"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role Privilege</label>
                  <select
                    name="role"
                    className="form-control"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="officer">Procurement Officer (Creates RFQs, Compares Quotes)</option>
                    <option value="manager">Manager / Approver (Approves Bids)</option>
                    <option value="admin">System Administrator (Full access)</option>
                  </select>
                </div>

                <div className="modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none', marginTop: '24px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)} 
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? 'Registering...' : 'Add Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamManagement;
