import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertCircle, Loader } from 'lucide-react';

function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { acceptTeamInvitation } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setError('No invitation token was found in the link. Please check your email invitation URL.');
        setLoading(false);
        return;
      }

      try {
        const result = await acceptTeamInvitation(token);
        if (result.success) {
          setSuccess(true);
          // Automatically navigate to dashboard after 2.5 seconds
          setTimeout(() => {
            navigate('/company/dashboard');
          }, 2500);
        } else {
          setError(result.error || 'Failed to verify invitation.');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred during account activation.');
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [token, acceptTeamInvitation, navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '24px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '40px',
        textAlign: 'center',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: '16px'
      }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <Loader size={36} className="text-primary" style={{ animation: 'spin 1.5s linear infinite' }} />
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Verifying Invitation...</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                We are validating your secure credentials and activating your corporate operator profile. Please hold on.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--error)'
            }}>
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--error)' }}>Activation Failed</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                {error}
              </p>
              <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: '14px' }}>
                Return to Entrance
              </Link>
            </div>
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-company)'
            }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-company)' }}>Invitation Accepted!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                Your account is now activated. Logging you in automatically...
              </p>
              <button 
                onClick={() => navigate('/company/dashboard')} 
                className="btn btn-company" 
                style={{ padding: '10px 20px', fontSize: '14px' }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Keyframe animation for spinner fallback (since no keyframe transitions are used on actual page views) */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AcceptInvite;
