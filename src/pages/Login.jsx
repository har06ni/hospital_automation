import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, ShieldCheck, Mail, Lock, ArrowLeft, Pill, ShieldAlert } from 'lucide-react';
import '../styles/global.css';

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleConfig = {
    nurse: { title: 'Nurse', icon: <User size={32} />, color: 'nurse-icon', desc: 'Patient Care & Vitals', email: 'nurse@hospital.com' },
    doctor: { title: 'Doctor', icon: <Stethoscope size={32} />, color: 'doctor-icon', desc: 'Priority Queue & Review', email: 'doctor@hospital.com' },
    admin: { title: 'Admin', icon: <ShieldCheck size={32} />, color: 'admin-icon', desc: 'System Control', email: 'admin@hospital.com' },
    patient: { title: 'Patient', icon: <User size={32} />, color: 'patient-icon', desc: 'Records & Appointments', email: 'patient@hospital.com' }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userEmail', data.username);
        localStorage.setItem('_id', data._id);

        switch (data.role) {
          case 'nurse': navigate('/nurse'); break;
          case 'doctor': navigate('/doctor'); break;
          case 'admin': navigate('/admin'); break;
          case 'patient': navigate('/appointments'); break;
          default: navigate('/'); break;
        }
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Connection to server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail(''); // Don't pre-fill email
    setPassword(''); // Don't pre-fill password
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <div className="logo-section">
          <div className="logo-icon">🏥</div>
          <h1>Hospital Automate</h1>
          <p>{selectedRole ? `Secure Login for ${roleConfig[selectedRole].title}` : 'Select your role to continue'}</p>
        </div>

        {!selectedRole ? (
          <div className="role-grid">
            {Object.entries(roleConfig).map(([key, config]) => (
              <button key={key} className="role-card" onClick={() => handleRoleSelect(key)}>
                <div className={`icon-wrapper ${config.color}`}>
                  {config.icon}
                </div>
                <h3>{config.title}</h3>
                <p>{config.desc}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="login-form-wrapper">
            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={20} className="input-icon" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              {error && <p className="error-text">{error}</p>}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <button type="button" className="back-btn" onClick={() => setSelectedRole(null)}>
                <ArrowLeft size={16} /> Back to Roles
              </button>
            </form>

          </div>
        )}
      </div>
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
        }
        .login-card {
          width: 100%;
          max-width: 800px;
          padding: 60px 40px;
          text-align: center;
          border-radius: 24px;
        }
        .logo-section {
          margin-bottom: 40px;
        }
        .logo-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .logo-section h1 {
          font-size: 2.8rem;
          margin: 0;
          color: var(--primary-color);
          font-weight: 800;
          letter-spacing: -1px;
        }
        .logo-section p {
          color: var(--text-secondary);
          font-weight: 500;
        }
        .role-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 20px;
        }
        .role-card {
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          padding: 30px 20px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .role-card:hover {
          transform: translateY(-10px);
          background: white;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border-color: var(--primary-color);
        }
        .icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          background: #f1f5f9;
          transition: all 0.3s ease;
        }
        .nurse-icon { color: var(--primary-color); }
        .doctor-icon { color: var(--success-color); }
        .admin-icon { color: var(--danger-color); }
        .patient-icon { color: var(--warning-color); }

        .role-card:hover .icon-wrapper { transform: scale(1.1); }
        
        .login-form-wrapper {
          max-width: 400px;
          margin: 0 auto;
          text-align: left;
          animation: slideUp 0.4s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .input-group {
          margin-bottom: 20px;
        }
        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
        }
        .input-wrapper input {
          width: 100%;
          padding: 12px 12px 12px 42px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-wrapper input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: filter 0.2s;
          margin-top: 10px;
        }
        .login-btn:hover { filter: brightness(1.1); }
        .login-btn:disabled { background: #94a3b8; cursor: not-allowed; }
        
        .back-btn {
          width: 100%;
          background: none;
          border: none;
          color: var(--text-secondary);
          margin-top: 20px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.9rem;
        }
        .error-text {
          color: var(--danger-color);
          font-size: 0.85rem;
          margin-bottom: 15px;
          font-weight: 600;
        }
        .demo-notice {
          margin-top: 30px;
          padding: 12px;
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 10px;
          color: #92400e;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
export default Login;
