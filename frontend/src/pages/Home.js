import React, { useContext, useEffect, useState, useRef } from 'react';
import { WalletContext } from '../context/WalletContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Animated particle background
const Particles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 4 + 2}px`,
    duration: `${Math.random() * 15 + 10}s`,
    delay: `${Math.random() * 10}s`,
    color: ['#6C63FF', '#FF6584', '#43E97B', '#4FACFE', '#FEE140'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: p.left, bottom: '-10px',
          width: p.size, height: p.size, borderRadius: '50%',
          background: p.color, opacity: 0.6,
          animation: `particleFloat ${p.duration} ${p.delay} linear infinite`,
        }} />
      ))}
    </div>
  );
};

// Animated counter
const Counter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 40);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count}{suffix}</span>;
};

const features = [
  { icon: '🔒', title: 'Smart Contract Escrow', desc: 'Funds locked in blockchain until job completion. Zero risk of payment fraud.', color: '#6C63FF' },
  { icon: '⚡', title: 'Instant Settlements', desc: 'Payment released automatically on job completion. No waiting, no delays.', color: '#43E97B' },
  { icon: '🌍', title: 'Global Marketplace', desc: 'Connect with talent and clients from 150+ countries, 24/7.', color: '#4FACFE' },
  { icon: '💎', title: 'Dual Auth System', desc: 'Login with MetaMask wallet or email — your choice, your control.', color: '#FF6584' },
  { icon: '🤝', title: 'Direct Messaging', desc: 'Real-time chat between clients and freelancers after job acceptance.', color: '#FEE140' },
  { icon: '⭐', title: 'Review System', desc: 'Build your reputation with verified on-chain reviews and ratings.', color: '#FA709A' },
];

const stats = [
  { value: 1240, suffix: '+', label: 'Jobs Posted' },
  { value: 890, suffix: '+', label: 'Freelancers' },
  { value: 98, suffix: '%', label: 'Success Rate' },
  { value: 45, suffix: 'K', label: 'ETH Transacted' },
];

const Home = () => {
  const { currentAccount, connectWallet, isConnecting, walletError } = useContext(WalletContext);
  const { user } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Particles />

      {/* Hero Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: '50px', padding: '8px 20px', marginBottom: '32px',
            animation: 'fadeInDown 0.6s ease-out',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#43E97B', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600' }}>
              Web3 Freelance Platform — Powered by Ethereum
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(42px, 7vw, 80px)',
            fontWeight: '800', lineHeight: '1.1',
            marginBottom: '24px',
            animation: 'fadeInUp 0.7s ease-out 0.1s both',
          }}>
            <span style={{ color: 'white' }}>The Future of</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 50%, #43E97B 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 4s ease infinite',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Freelancing is Here</span>
          </h1>

          <p style={{
            fontSize: '18px', color: 'rgba(255,255,255,0.6)',
            maxWidth: '600px', margin: '0 auto 48px',
            lineHeight: '1.7',
            animation: 'fadeInUp 0.7s ease-out 0.2s both',
          }}>
            Post jobs, hire talent, and get paid securely using blockchain technology.
            No middlemen. No hidden fees. Just pure decentralized work.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeInUp 0.7s ease-out 0.3s both',
          }}>
            {!currentAccount && !user ? (
              <>
                <button onClick={connectWallet} disabled={isConnecting}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '16px 36px', borderRadius: '50px',
                    background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                    color: 'white', border: 'none', cursor: 'pointer',
                    fontSize: '16px', fontWeight: '700',
                    boxShadow: '0 8px 30px rgba(108,99,255,0.5)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(108,99,255,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(108,99,255,0.5)'; }}
                >
                  {isConnecting ? <><div className="spinner" /><span>Connecting...</span></> : <><span>🦊</span><span>Connect MetaMask</span></>}
                </button>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '16px 36px', borderRadius: '50px',
                    background: 'rgba(255,255,255,0.07)', color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                    fontSize: '16px', fontWeight: '700', transition: 'all 0.3s ease',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    📧 Sign Up with Email
                  </button>
                </Link>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  { to: '/post-job', label: '✏️ Post a Job', grad: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', shadow: 'rgba(108,99,255,0.5)' },
                  { to: '/browse-jobs', label: '🔍 Browse Jobs', grad: 'linear-gradient(135deg, #43E97B, #38F9D7)', shadow: 'rgba(67,233,123,0.4)' },
                  { to: '/dashboard', label: '📊 Dashboard', grad: 'linear-gradient(135deg, #FA709A, #FEE140)', shadow: 'rgba(250,112,154,0.4)' },
                ].map(btn => (
                  <Link key={btn.to} to={btn.to} style={{ textDecoration: 'none' }}>
                    <button style={{
                      padding: '14px 30px', borderRadius: '50px',
                      background: btn.grad, color: btn.to === '/browse-jobs' ? '#0D0D1A' : 'white',
                      border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '700',
                      boxShadow: `0 8px 25px ${btn.shadow}`, transition: 'all 0.3s ease',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >{btn.label}</button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {walletError && (
            <div className="alert alert-error" style={{ maxWidth: '500px', margin: '20px auto 0' }}>
              ⚠️ {walletError}
            </div>
          )}

          {/* Connection status */}
          {(currentAccount || user) && (
            <div style={{
              display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap',
              marginTop: '24px', animation: 'fadeIn 0.5s ease-out',
            }}>
              {currentAccount && (
                <div className="wallet-chip">
                  <span>🦊</span> {currentAccount.slice(0, 8)}...{currentAccount.slice(-6)}
                </div>
              )}
              {user && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(79,172,254,0.1)', border: '1px solid rgba(79,172,254,0.3)',
                  borderRadius: '50px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', color: '#4FACFE',
                }}>
                  <span>📧</span> {user.email || user.name}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div ref={statsRef} style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '20px', marginBottom: '100px',
          animation: 'fadeInUp 0.7s ease-out 0.4s both',
        }}>
          {stats.map((stat, i) => (
            <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-number">
                {statsVisible ? <Counter end={stat.value} suffix={stat.suffix} /> : '0'}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ marginBottom: '100px', animation: 'fadeInUp 0.7s ease-out 0.5s both' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to get started</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { step: '01', icon: '🔗', title: 'Connect & Register', desc: 'Connect your MetaMask wallet or sign up with email. Both methods are fully supported.' },
              { step: '02', icon: '💼', title: 'Post or Find Jobs', desc: 'Clients post jobs with ETH escrow or USD budget. Freelancers browse and apply instantly.' },
              { step: '03', icon: '💰', title: 'Work & Get Paid', desc: 'Complete the job, client releases payment. Smart contract ensures trustless settlement.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.background = 'rgba(108,99,255,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              >
                <div style={{
                  position: 'absolute', top: '20px', right: '20px',
                  fontSize: '48px', fontWeight: '900', opacity: '0.06',
                  fontFamily: "'Space Grotesk', sans-serif", color: 'white',
                }}>{item.step}</div>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        {visible && (
          <div style={{ marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 className="section-title">Why FreelanceChain?</h2>
              <p className="section-subtitle">Built for the decentralized future of work</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {features.map((f, i) => (
                <div key={i} className="job-card" style={{ animationDelay: `${i * 0.08}s`, animation: 'fadeInUp 0.6s ease-out both' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: `${f.color}20`, border: `1px solid ${f.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', marginBottom: '16px',
                  }}>{f.icon}</div>
                  <h3 style={{ color: 'white', fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>{f.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.2) 0%, rgba(255,101,132,0.2) 100%)',
          border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: '24px', padding: '60px 40px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          animation: 'fadeInUp 0.7s ease-out 0.6s both',
        }}>
          <div style={{
            position: 'absolute', top: '-50px', right: '-50px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,99,255,0.3), transparent)',
            pointerEvents: 'none',
          }} />
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800',
            color: 'white', marginBottom: '16px',
          }}>Ready to Start Building?</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
            Join thousands of freelancers and clients already using FreelanceChain.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/browse-jobs" style={{ textDecoration: 'none' }}>
              <button className="btn-gradient" style={{ padding: '14px 32px', fontSize: '15px' }}>
                🔍 Browse Jobs Now
              </button>
            </Link>
            <Link to="/post-job" style={{ textDecoration: 'none' }}>
              <button className="btn-outline" style={{ padding: '14px 32px', fontSize: '15px' }}>
                ✏️ Post a Job
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
