import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WalletContext } from '../context/WalletContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const { login } = useContext(AuthContext);
  const { connectWallet, currentAccount, isConnecting } = useContext(WalletContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('email'); // 'email' | 'wallet'

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  const handleWalletLogin = async () => {
    try {
      setLoading(true); setError('');
      await connectWallet();
      // After wallet connected, authenticate with backend
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const res = await axios.post(`${API_URL}/auth/wallet-auth`, { walletAddress: accounts[0] });
        localStorage.setItem('token', res.data.token);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Wallet login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
      position: 'relative', zIndex: 1,
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.12), transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px',
        padding: '48px', maxWidth: '460px', width: '100%',
        animation: 'fadeInUp 0.6s ease-out',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>🔐</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: '700',
            background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: '8px',
          }}>Welcome Back</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Sign in to your FreelanceChain account</p>
        </div>

        {/* Tab switcher */}
        <div className="tab-group">
          <button className={`tab-btn ${tab === 'email' ? 'active' : ''}`} onClick={() => setTab('email')}>
            📧 Email Login
          </button>
          <button className={`tab-btn ${tab === 'wallet' ? 'active' : ''}`} onClick={() => setTab('wallet')}>
            🦊 MetaMask
          </button>
        </div>

        {/* Email Login */}
        {tab === 'email' && (
          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required disabled={loading}
                className="input-dark" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" placeholder="Enter your password" value={password}
                onChange={e => setPassword(e.target.value)} required disabled={loading}
                className="input-dark" />
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <button type="submit" disabled={loading} className="btn-gradient"
              style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '14px' }}>
              {loading ? <><div className="spinner" style={{ display: 'inline-block', marginRight: '8px' }} />Signing in...</> : 'Sign In'}
            </button>
          </form>
        )}

        {/* Wallet Login */}
        {tab === 'wallet' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)',
              borderRadius: '16px', padding: '24px', marginBottom: '24px',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🦊</div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6' }}>
                Connect your MetaMask wallet to sign in. A new account will be created automatically if you're new.
              </p>
            </div>

            {currentAccount && (
              <div className="wallet-chip" style={{ marginBottom: '20px', justifyContent: 'center' }}>
                ✅ {currentAccount.slice(0, 10)}...{currentAccount.slice(-8)}
              </div>
            )}

            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <button onClick={handleWalletLogin} disabled={loading || isConnecting} className="btn-gradient"
              style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '14px' }}>
              {loading || isConnecting
                ? <><div className="spinner" style={{ display: 'inline-block', marginRight: '8px' }} />Connecting...</>
                : '🦊 Connect & Sign In'}
            </button>
          </div>
        )}

        <div style={{ marginTop: '28px', textAlign: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6C63FF', fontWeight: '700', textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
