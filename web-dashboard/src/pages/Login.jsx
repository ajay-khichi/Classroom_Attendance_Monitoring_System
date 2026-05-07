import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import collegeImage from '../assets/college.jpg';

export default function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Left side - Cover Image */}
      <div style={{
        flex: 1,
        position: 'relative',
        backgroundImage: `url(${collegeImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'none', // Will be block on larger screens, handled via media query normally but we'll force it here
      }} className="desktop-only-bg">
        {/* Dark Teal Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(26, 54, 68, 0.85) 0%, rgba(44, 123, 142, 0.7) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px',
          color: 'white'
        }}>
          <div className="fade-in" style={{ maxWidth: '600px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '32px', marginBottom: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              A
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px', lineHeight: 1.1 }}>
              AttendSoft
            </h1>
            <h2 style={{ fontSize: '24px', fontWeight: '400', opacity: 0.9, marginBottom: '24px' }}>
              Chameli Devi Group of Institutions
            </h2>
            <p style={{ fontSize: '16px', opacity: 0.8, lineHeight: 1.6, maxWidth: '80%' }}>
              Welcome to the modern classroom attendance monitoring system. Fast, reliable, and secure face-recognition powered attendance.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div style={{
        flex: '0 0 100%',
        maxWidth: '500px',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.05)',
        zIndex: 10
      }} className="login-form-container">
        
        <div className="fade-in" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
              Welcome Back
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Please sign in to your account
            </p>
          </div>

          {/* Role Selection */}
          <div style={{ display: 'flex', background: 'var(--bg-color)', padding: '6px', borderRadius: '12px', marginBottom: '32px' }}>
            <button 
              onClick={() => setRole('admin')}
              style={{ flex: 1, padding: '10px 0', border: 'none', background: role === 'admin' ? 'white' : 'transparent', color: role === 'admin' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: role === 'admin' ? '600' : '500', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: role === 'admin' ? 'var(--shadow-sm)' : 'none' }}
            >
              Administrator
            </button>
            <button 
              onClick={() => setRole('teacher')}
              style={{ flex: 1, padding: '10px 0', border: 'none', background: role === 'teacher' ? 'white' : 'transparent', color: role === 'teacher' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: role === 'teacher' ? '600' : '500', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: role === 'teacher' ? 'var(--shadow-sm)' : 'none' }}
            >
              Faculty
            </button>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>Email Address</label>
            <input
              className={`form-input ${emailError ? 'error' : ''}`}
              style={{ padding: '14px 16px' }}
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
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className={`form-input ${passwordError ? 'error' : ''}`}
                style={{ padding: '14px 16px', paddingRight: '40px' }}
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
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '16px', cursor: 'pointer' }}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {passwordError && <span className="error-text">{passwordError}</span>}
          </div>

          {/* Login btn */}
          <button
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: '600', borderRadius: '10px' }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Need help accessing your account? Contact IT Support.
          </p>

        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .desktop-only-bg {
            display: block !important;
          }
          .login-form-container {
            flex: 0 0 400px !important;
            max-width: none !important;
          }
        }
        @media (min-width: 1200px) {
          .login-form-container {
            flex: 0 0 500px !important;
          }
        }
      `}</style>
    </div>
  );
}
