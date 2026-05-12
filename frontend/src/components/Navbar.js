import React, { useContext, useState, useEffect } from 'react';
import { WalletContext } from '../context/WalletContext';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0 0 8px rgba(108,99,255,0.6))' }}>
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6C63FF"/>
        <stop offset="100%" stopColor="#FF6584"/>
      </linearGradient>
    </defs>
    {/* Hexagon base */}
    <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="url(#logoGrad)" opacity="0.9"/>
    {/* Chain links */}
    <path d="M12 14h4a2 2 0 0 1 0 4h-4a2 2 0 0 1 0-4z" fill="white" opacity="0.9"/>
    <path d="M20 18h4a2 2 0 0 1 0 4h-4a2 2 0 0 1 0-4z" fill="white" opacity="0.9"/>
    <path d="M16 16h4v4h-4z" fill="white" opacity="0.7"/>
    {/* Center dot */}
    <circle cx="18" cy="18" r="2" fill="white"/>
  </svg>
);

const Navbar = () => {
  const { currentAccount, connectWallet, disconnectWallet, isConnecting } = useContext(WalletContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: '⚡' },
    { to: '/browse-jobs', label: 'Browse Jobs', icon: '🔍' },
    { to: '/post-job', label: 'Post Job', icon: '✏️' },
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/messages', label: 'Messages', icon: '💬' },
  ];

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(13,13,26,0.95)' : 'rgba(13,13,26,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(108,99,255,0.2)' : '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 24px', height: '70px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ animation: 'float 3s ease-in-out infinite' }}>
              <Logo />
            </div>
            <div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '20px', fontWeight: '700',
                background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                lineHeight: 1,
              }}>FreelanceChain</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Web3 Marketplace
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '8px 16px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600',
                  color: isActive(link.to) ? 'white' : 'rgba(255,255,255,0.55)',
                  background: isActive(link.to) ? 'rgba(108,99,255,0.2)' : 'transparent',
                  border: isActive(link.to) ? '1px solid rgba(108,99,255,0.4)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
                  onMouseEnter={e => { if (!isActive(link.to)) { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}}
                  onMouseLeave={e => { if (!isActive(link.to)) { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'transparent'; }}}
                >
                  <span style={{ fontSize: '13px' }}>{link.icon}</span>
                  {link.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Right side: wallet + auth */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Wallet button */}
            {!currentAccount ? (
              <button onClick={connectWallet} disabled={isConnecting}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '9px 18px', borderRadius: '50px',
                  background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                  color: 'white', border: 'none', cursor: 'pointer',
                  fontWeight: '700', fontSize: '13px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(108,99,255,0.4)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(108,99,255,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(108,99,255,0.4)'; }}
              >
                {isConnecting ? <><div className="spinner" style={{ width: '14px', height: '14px' }} /><span>Connecting...</span></> : <><span>🦊</span><span>Connect Wallet</span></>}
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="wallet-chip" style={{ fontSize: '12px', padding: '6px 14px' }}>
                  <span>●</span>
                  {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                </div>
                <button onClick={disconnectWallet}
                  style={{
                    padding: '7px 14px', borderRadius: '50px',
                    background: 'rgba(255,101,132,0.15)', color: '#FF6584',
                    border: '1px solid rgba(255,101,132,0.3)', cursor: 'pointer',
                    fontSize: '12px', fontWeight: '600', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,101,132,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,101,132,0.15)'; }}
                >
                  Disconnect
                </button>
              </div>
            )}

            {/* Auth */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  padding: '7px 14px', borderRadius: '50px',
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.85)',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span>👤</span> {user.name?.split(' ')[0]}
                </div>
                <button onClick={logout}
                  style={{
                    padding: '7px 14px', borderRadius: '50px',
                    background: 'transparent', color: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                    fontSize: '12px', fontWeight: '600', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '8px 18px', borderRadius: '50px',
                    background: 'transparent', color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '600', transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  >Login</button>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '8px 18px', borderRadius: '50px',
                    background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)',
                    color: 'white', border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '700', transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(108,99,255,0.3)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(108,99,255,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(108,99,255,0.3)'; }}
                  >Sign Up</button>
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none', background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                padding: '8px 12px', cursor: 'pointer', color: 'white', fontSize: '18px',
              }}
              className="mobile-menu-btn"
            >☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: 'rgba(13,13,26,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 24px', animation: 'fadeInDown 0.2s ease-out',
          }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  padding: '12px 16px', borderRadius: '10px', marginBottom: '4px',
                  color: isActive(link.to) ? 'white' : 'rgba(255,255,255,0.6)',
                  background: isActive(link.to) ? 'rgba(108,99,255,0.2)' : 'transparent',
                  fontWeight: '600', fontSize: '15px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  {link.icon} {link.label}
                </div>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
