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
  const [tab, setTab] = useState('email');

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
      minHeight: 'calc(100vh - 64px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
      background: '#F9FAFB',
    }}>
      <div style={{
        background: 'white', border: '1px solid #E5E7EB',
        borderRadius: '12px', padding: '40px',
        maxWidth: '440px', width: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        animation: 'fadeInUp 0.4s ease-out',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '4px', letterSpacing: '-0.3px' }}>
            Welcome back
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Sign in to your WorkNova account</p>
        </div>

        {/* Tab switcher */}
        <div className="tab-group">
          <button className={`tab-btn ${tab === 'email' ? 'active' : ''}`} onClick={() => setTab('email')}>
            Email
          </button>
          <button className={`tab-btn ${tab === 'wallet' ? 'active' : ''}`} onClick={() => setTab('wallet')}>
            MetaMask
          </button>
        </div>

        {/* Email Login */}
        {tab === 'email' && (
          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label className="form-label">Email address</label>
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

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" disabled={loading} className="btn-gradient"
              style={{ width: '100%', padding: '11px', fontSize: '14px', borderRadius: '6px', marginTop: '4px' }}>
              {loading
                ? <><div className="spinner" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /><span>Signing in...</span></>
                : 'Sign in'
              }
            </button>
          </form>
        )}

        {/* Wallet Login */}
        {tab === 'wallet' && (
          <div>
            <div style={{
              background: '#F9FAFB', border: '1px solid #E5E7EB',
              borderRadius: '8px', padding: '20px', marginBottom: '20px',
            }}>
              <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                Connect your MetaMask wallet to sign in. A new account will be created automatically if you're new.
              </p>
            </div>

            {currentAccount && (
              <div className="wallet-chip" style={{ marginBottom: '16px', width: '100%', justifyContent: 'center' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
                {currentAccount.slice(0, 10)}...{currentAccount.slice(-8)}
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            <button onClick={handleWalletLogin} disabled={loading || isConnecting} className="btn-gradient"
              style={{ width: '100%', padding: '11px', fontSize: '14px', borderRadius: '6px' }}>
              {loading || isConnecting
                ? <><div className="spinner" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /><span>Connecting...</span></>
                : 'Connect & Sign In'
              }
            </button>
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563EB', fontWeight: '500', textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
