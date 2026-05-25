import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'freelancer' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) {
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } else setError(result.message);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
      background: '#F9FAFB',
    }}>
      <div style={{
        background: 'white', border: '1px solid #E5E7EB',
        borderRadius: '12px', padding: '40px',
        maxWidth: '460px', width: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        animation: 'fadeInUp 0.4s ease-out',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '4px', letterSpacing: '-0.3px' }}>
            Create your account
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Join the WorkNova marketplace</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input type="text" placeholder="John Doe" value={form.name}
              onChange={set('name')} required disabled={loading} className="input-dark" />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={set('email')} required disabled={loading} className="input-dark" />
          </div>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['freelancer', 'client'].map(r => (
                <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '6px', cursor: 'pointer',
                    border: form.role === r ? '1px solid #2563EB' : '1px solid #D1D5DB',
                    background: form.role === r ? '#EFF6FF' : 'white',
                    color: form.role === r ? '#2563EB' : '#6B7280',
                    fontWeight: form.role === r ? '600' : '400',
                    fontSize: '14px', transition: 'all 0.15s ease',
                    fontFamily: "'Inter', sans-serif",
                    textTransform: 'capitalize',
                  }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" placeholder="Min. 6 characters" value={form.password}
              onChange={set('password')} required disabled={loading} className="input-dark" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input type="password" placeholder="Repeat your password" value={form.confirm}
              onChange={set('confirm')} required disabled={loading} className="input-dark" />
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button type="submit" disabled={loading} className="btn-gradient"
            style={{ width: '100%', padding: '11px', fontSize: '14px', borderRadius: '6px', marginTop: '4px' }}>
            {loading
              ? <><div className="spinner" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /><span>Creating account...</span></>
              : 'Create account'
            }
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563EB', fontWeight: '500', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
