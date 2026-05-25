import React, { useContext, useState, useEffect } from 'react';
import { WalletContext } from '../context/WalletContext';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="7" fill="#2563EB"/>
    <path d="M9 9.5L15.5 14L9 18.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="19" cy="14" r="1.8" fill="white"/>
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
    { to: '/', label: 'Home' },
    { to: '/browse-jobs', label: 'Browse Jobs' },
    { to: '/post-job', label: 'Post Job' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/messages', label: 'Messages' },
  ];

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        transition: 'box-shadow 0.15s ease',
        boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 24px', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '16px', fontWeight: '700',
              color: '#111827',
              letterSpacing: '-0.3px',
            }}>WorkNova</span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '6px 14px', borderRadius: '6px',
                  fontSize: '14px', fontWeight: isActive(link.to) ? '600' : '400',
                  color: isActive(link.to) ? '#111827' : '#6B7280',
                  background: isActive(link.to) ? '#EFF6FF' : 'transparent',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => { if (!isActive(link.to)) { e.currentTarget.style.color = '#111827'; e.currentTarget.style.background = '#F9FAFB'; }}}
                  onMouseLeave={e => { if (!isActive(link.to)) { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.background = 'transparent'; }}}
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

            {/* Wallet */}
            {!currentAccount ? (
              <button onClick={connectWallet} disabled={isConnecting}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '6px',
                  background: '#2563EB', color: 'white',
                  border: 'none', cursor: 'pointer',
                  fontWeight: '500', fontSize: '13px',
                  transition: 'background 0.15s ease',
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1D4ED8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; }}
              >
                {isConnecting
                  ? <><div className="spinner" style={{ width: '13px', height: '13px', borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /><span>Connecting...</span></>
                  : <span>Connect Wallet</span>
                }
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div className="wallet-chip">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
                  {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                </div>
                <button onClick={disconnectWallet}
                  style={{
                    padding: '5px 11px', borderRadius: '6px',
                    background: 'transparent', color: '#DC2626',
                    border: '1px solid #FECACA', cursor: 'pointer',
                    fontSize: '12px', fontWeight: '500',
                    transition: 'all 0.15s ease',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Disconnect
                </button>
              </div>
            )}

            {/* Auth */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  padding: '5px 12px', borderRadius: '6px',
                  background: '#F3F4F6', border: '1px solid #E5E7EB',
                  fontSize: '13px', fontWeight: '500', color: '#374151',
                }}>
                  {user.name?.split(' ')[0]}
                </div>
                <button onClick={logout}
                  style={{
                    padding: '5px 11px', borderRadius: '6px',
                    background: 'transparent', color: '#6B7280',
                    border: '1px solid #E5E7EB', cursor: 'pointer',
                    fontSize: '12px', fontWeight: '500',
                    transition: 'all 0.15s ease',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '6px' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '7px 14px', borderRadius: '6px',
                    background: 'transparent', color: '#374151',
                    border: '1px solid #D1D5DB', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '500',
                    transition: 'all 0.15s ease',
                    fontFamily: "'Inter', sans-serif",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#9CA3AF'; e.currentTarget.style.color = '#111827'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.color = '#374151'; }}
                  >Log in</button>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '7px 14px', borderRadius: '6px',
                    background: '#2563EB', color: 'white',
                    border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '500',
                    transition: 'background 0.15s ease',
                    fontFamily: "'Inter', sans-serif",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#1D4ED8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; }}
                  >Sign up</button>
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none', background: '#F3F4F6',
                border: '1px solid #E5E7EB', borderRadius: '6px',
                padding: '6px 10px', cursor: 'pointer', color: '#374151', fontSize: '16px',
                lineHeight: 1,
              }}
              className="mobile-menu-btn"
            >☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: '#FFFFFF', borderTop: '1px solid #E5E7EB',
            padding: '12px 24px 16px', animation: 'fadeInDown 0.15s ease-out',
          }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  padding: '10px 12px', borderRadius: '6px', marginBottom: '2px',
                  color: isActive(link.to) ? '#2563EB' : '#374151',
                  background: isActive(link.to) ? '#EFF6FF' : 'transparent',
                  fontWeight: isActive(link.to) ? '600' : '400',
                  fontSize: '15px',
                }}>
                  {link.label}
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
