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
      minHeight: 'calc(100vh - 70px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,101,132,0.1), transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px',
        padding: '48px', maxWidth: '480px', width: '100%',
        animation: 'fadeInUp 0.6s ease-out',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>🚀</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: '700',
            background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: '8px',
          }}>Create Account</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Join the decentralized freelance revolution</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" placeholder="John Doe" value={form.name}
              onChange={set('name')} required disabled={loading} className="input-dark" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={set('email')} required disabled={loading} className="input-dark" />
          </div>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['freelancer', 'client'].map(r => (
                <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                    border: form.role === r ? '1px solid rgba(108,99,255,0.6)' : '1px solid rgba(255,255,255,0.1)',
                    background: form.role === r ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.03)',
                    color: form.role === r ? '#6C63FF' : 'rgba(255,255,255,0.5)',
                    fontWeight: '600', fontSize: '14px', transition: 'all 0.2s ease',
                  }}>
                  {r === 'freelancer' ? '👨‍💻 Freelancer' : '🏢 Client'}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password}
              onChange={set('password')} required disabled={loading} className="input-dark" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" placeholder="Repeat your password" value={form.confirm}
              onChange={set('confirm')} required disabled={loading} className="input-dark" />
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}
          {success && <div className="alert alert-success">✅ {success}</div>}

          <button type="submit" disabled={loading} className="btn-gradient"
            style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '14px' }}>
            {loading ? <><div className="spinner" style={{ display: 'inline-block', marginRight: '8px' }} />Creating Account...</> : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6C63FF', fontWeight: '700', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
