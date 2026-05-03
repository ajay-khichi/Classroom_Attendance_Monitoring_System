import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = emailTouched && (!email ? 'Email is required' : !isEmailValid ? 'Please enter a valid email' : '');

  const passLengthError = password.length < 8 ? 'Password must be at least 8 characters' : password.length > 16 ? 'Password must be no more than 16 characters' : '';
  const passwordError = passwordTouched && passLengthError ? passLengthError : '';

  const handleLogin = async () => {
    setEmailTouched(true);
    setPasswordTouched(true);
    if (!email || !password || emailError || passLengthError) {
      return toast.error('Please fix the errors before logging in');
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'var(--bg-color)'
    }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: '420px', padding: '0', overflow: 'hidden' }}>
        
        {/* Topbar */}
        <div style={{ background: 'var(--primary)', padding: '20px', textAlign: 'center', color: 'white' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>AttendSoft</h1>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>CDGI Attendance System</p>
        </div>

        {/* Card body */}
        <div style={{ padding: '32px' }}>
          
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            {!logoError ? (
              <img
                src="/cdgi_logo.jpeg"
                alt="CDGI Logo"
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'contain', boxShadow: 'var(--shadow-sm)' }}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700', margin: '0 auto' }}>A</div>
            )}
          </div>

          {/* Role */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
              <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} style={{ accentColor: 'var(--primary)' }} />
              Administrator
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
              <input type="radio" name="role" value="teacher" checked={role === 'teacher'} onChange={() => setRole('teacher')} style={{ accentColor: 'var(--primary)' }} />
              Faculty
            </label>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-muted)' }}>Email Address</label>
            <input
              className={`form-input ${emailError ? 'error' : ''}`}
              type="email"
              placeholder={role === 'admin' ? 'admin@cdgi.ac.in' : 'faculty@cdgi.ac.in'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              onKeyDown={handleKeyDown}
            />
            {emailError && <span className="error-text">{emailError}</span>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-muted)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className={`form-input ${passwordError ? 'error' : ''}`}
                style={{ paddingRight: '40px' }}
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '16px' }}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {passwordError && <span className="error-text">{passwordError}</span>}
          </div>

          {/* Login btn */}
          <button
            className="btn-primary"
            style={{ width: '100%', padding: '12px' }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

        </div>
      </div>
    </div>
  );
}
