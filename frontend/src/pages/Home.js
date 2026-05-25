import React, { useContext, useEffect, useState, useRef } from 'react';
import { WalletContext } from '../context/WalletContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

/* ── scroll-reveal hook ─────────────────────────────────────── */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

/* ── animated counter ───────────────────────────────────────── */
const Counter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / 45;
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 35);
    return () => clearInterval(t);
  }, [end]);
  return <span>{count}{suffix}</span>;
};

/* ── hero preview mock card ─────────────────────────────────── */
const PreviewCard = () => (
  <div style={{
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '16px', padding: '20px', width: '320px',
    animation: 'previewFloat 5s ease-in-out infinite',
    backdropFilter: 'blur(12px)',
  }}>
    {/* header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: '14px' }}>Recent Jobs</span>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Live</span>
    </div>

    {/* mock job 1 */}
    {[
      { title: 'React Developer', pay: '0.5 ETH', time: '2h ago', tags: ['React', 'TypeScript'] },
      { title: 'Smart Contract Audit', pay: '1.2 ETH', time: '5h ago', tags: ['Solidity', 'Security'] },
      { title: 'UI/UX Designer', pay: '$800', time: '8h ago', tags: ['Figma', 'Design'] },
    ].map((job, i) => (
      <div key={i} style={{
        background: 'rgba(255,255,255,0.06)', borderRadius: '10px',
        padding: '13px 14px', marginBottom: '10px',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'background 0.2s',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: '13px' }}>{job.title}</span>
          <span style={{ color: '#93C5FD', fontWeight: '600', fontSize: '12px' }}>{job.pay}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {job.tags.map(t => (
            <span key={t} style={{
              background: 'rgba(99,102,241,0.25)', color: '#A5B4FC',
              borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '500',
            }}>{t}</span>
          ))}
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginLeft: 'auto' }}>{job.time}</span>
        </div>
      </div>
    ))}

    {/* trust line */}
    <div style={{
      marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px',
      background: 'rgba(22,163,74,0.15)', borderRadius: '8px', padding: '10px 13px',
      border: '1px solid rgba(22,163,74,0.25)',
    }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block', flexShrink: 0 }} />
      <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}>Payment secured by smart contract</span>
    </div>
  </div>
);

/* ── data ───────────────────────────────────────────────────── */
const stats = [
  { value: 1240, suffix: '+', label: 'Jobs Posted' },
  { value: 890,  suffix: '+', label: 'Freelancers' },
  { value: 98,   suffix: '%', label: 'Success Rate' },
  { value: 45,   suffix: 'K', label: 'ETH Transacted' },
];

const steps = [
  { n: '01', title: 'Connect & Register', desc: 'Sign up with email or connect your MetaMask wallet in seconds.' },
  { n: '02', title: 'Post or Find Jobs',  desc: 'Clients post with ETH escrow or fixed budget. Freelancers browse and apply instantly.' },
  { n: '03', title: 'Work & Get Paid',    desc: 'Complete the job, client releases funds. Smart contract handles the rest.' },
];

const features = [
  { title: 'Smart Contract Escrow',  desc: 'Funds locked on-chain until job completion. Zero fraud risk.',      color: '#6366F1', bg: '#EEF2FF' },
  { title: 'Instant Settlements',    desc: 'Payment released automatically. No waiting, no delays.',             color: '#2563EB', bg: '#EFF6FF' },
  { title: 'Global Marketplace',     desc: 'Connect with talent and clients from anywhere, 24/7.',              color: '#0284C7', bg: '#F0F9FF' },
  { title: 'Dual Auth System',       desc: 'Use MetaMask wallet or email — your choice, your control.',          color: '#7C3AED', bg: '#F5F3FF' },
  { title: 'Direct Messaging',       desc: 'Real-time chat between clients and freelancers after acceptance.',   color: '#D97706', bg: '#FFFBEB' },
  { title: 'On-Chain Reviews',       desc: 'Build your reputation with verified blockchain-backed reviews.',     color: '#DC2626', bg: '#FEF2F2' },
];

/* ── component ──────────────────────────────────────────────── */
const Home = () => {
  const { currentAccount, connectWallet, isConnecting, walletError } = useContext(WalletContext);
  const { user } = useContext(AuthContext);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  useReveal();

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div>

      {/* ══════════════════════════════ DARK HERO ══════════════════════════════ */}
      <section style={{ background: '#0F172A', position: 'relative', overflow: 'hidden', padding: '88px 24px 108px' }}>

        {/* background orbs */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: '520px', height: '520px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
          animation: 'orbFloat 12s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-60px',
          width: '420px', height: '420px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
          animation: 'orbFloat 16s ease-in-out infinite reverse', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '64px', position: 'relative', zIndex: 1 }}>

          {/* ── left: text ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)',
              borderRadius: '20px', padding: '6px 16px', marginBottom: '28px',
              animation: 'heroIn 0.5s ease-out both',
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
              <span style={{ color: '#A5B4FC', fontSize: '13px', fontWeight: '500' }}>Live on Ethereum · Sepolia Testnet</span>
            </div>

            {/* headline */}
            <h1 style={{
              fontSize: 'clamp(34px, 5vw, 58px)', fontWeight: '800',
              lineHeight: '1.12', letterSpacing: '-1.5px',
              color: '#F8FAFC', marginBottom: '20px',
              animation: 'heroIn 0.55s ease-out 0.08s both',
            }}>
              Find World-Class<br />
              Talent.{' '}
              <span style={{
                background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Get Paid Securely.</span>
            </h1>

            {/* subtitle */}
            <p style={{
              fontSize: '17px', color: 'rgba(248,250,252,0.55)',
              maxWidth: '480px', lineHeight: '1.75', marginBottom: '36px',
              animation: 'heroIn 0.55s ease-out 0.16s both',
            }}>
              Post jobs, hire vetted freelancers, and receive payment locked by smart contracts — no middlemen, no hidden fees.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', animation: 'heroIn 0.55s ease-out 0.24s both' }}>
              {!currentAccount && !user ? (
                <>
                  <button onClick={connectWallet} disabled={isConnecting} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '13px 28px', borderRadius: '8px',
                    background: '#6366F1', color: 'white', border: 'none',
                    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                    transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif",
                    boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.4)'; }}
                  >
                    {isConnecting
                      ? <><div className="spinner" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.25)' }} /><span>Connecting...</span></>
                      : 'Connect MetaMask'
                    }
                  </button>
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <button style={{
                      padding: '13px 28px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(255,255,255,0.15)', fontSize: '15px',
                      fontWeight: '500', cursor: 'pointer',
                      transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                    >Sign up free</button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/browse-jobs" style={{ textDecoration: 'none' }}>
                    <button style={{
                      padding: '13px 28px', borderRadius: '8px',
                      background: '#6366F1', color: 'white', border: 'none',
                      fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                      transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif",
                      boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >Browse Jobs</button>
                  </Link>
                  <Link to="/post-job" style={{ textDecoration: 'none' }}>
                    <button style={{
                      padding: '13px 28px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(255,255,255,0.15)', fontSize: '15px',
                      fontWeight: '500', cursor: 'pointer',
                      transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                    >Post a Job</button>
                  </Link>
                </>
              )}
            </div>

            {walletError && (
              <div className="alert alert-error" style={{ maxWidth: '440px', marginTop: '20px', background: '#FEF2F2' }}>{walletError}</div>
            )}

            {/* trust indicators */}
            <div style={{ display: 'flex', gap: '24px', marginTop: '40px', animation: 'heroIn 0.55s ease-out 0.32s both', flexWrap: 'wrap' }}>
              {['890+ freelancers', '1,240+ jobs', '45K ETH secured'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span style={{ color: '#4ADE80', fontSize: '14px' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── right: preview card ── */}
          <div style={{ flexShrink: 0, animation: 'heroIn 0.7s ease-out 0.2s both' }} className="hero-preview-wrap">
            <PreviewCard />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ STATS BAR ══════════════════════════════ */}
      <section ref={statsRef} style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '28px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ fontSize: '26px', fontWeight: '700', color: '#2563EB', letterSpacing: '-0.5px' }}>
                {statsVisible ? <Counter end={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
              </div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════ HOW IT WORKS ═══════════════════════════ */}
      <section style={{ background: '#F8FAFC', padding: '88px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }} className="reveal">
            <p style={{ color: '#6366F1', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Simple process</p>
            <h2 className="section-title" style={{ fontSize: '32px', letterSpacing: '-0.6px' }}>How it works</h2>
            <p className="section-subtitle" style={{ maxWidth: '440px', margin: '8px auto 0' }}>From signup to payment in three straightforward steps</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {steps.map((s, i) => (
              <div key={i} className="reveal" style={{ animationDelay: `${i * 0.1}s`, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '32px', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: '#EEF2FF', color: '#6366F1', fontSize: '13px', fontWeight: '700', marginBottom: '18px' }}>{s.n}</div>
                <h3 style={{ color: '#111827', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.65' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ FEATURES ═══════════════════════════════ */}
      <section style={{ background: '#FFFFFF', padding: '88px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }} className="reveal">
            <p style={{ color: '#6366F1', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Platform benefits</p>
            <h2 className="section-title" style={{ fontSize: '32px', letterSpacing: '-0.6px' }}>Why WorkNova?</h2>
            <p className="section-subtitle" style={{ maxWidth: '420px', margin: '8px auto 0' }}>Everything you need to work with confidence</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {features.map((f, i) => (
              <div key={i} className="reveal job-card" style={{ animationDelay: `${i * 0.07}s` }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: f.color }} />
                </div>
                <h3 style={{ color: '#111827', fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>{f.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.65' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ CTA BANNER ═════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #312E81 100%)', padding: '80px 24px', textAlign: 'center' }} className="reveal">
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: '800', color: '#F8FAFC', letterSpacing: '-0.8px', marginBottom: '14px', lineHeight: '1.2' }}>
            Ready to start your next project?
          </h2>
          <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: '16px', marginBottom: '32px', lineHeight: '1.7' }}>
            Join thousands of freelancers and clients already working on WorkNova.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/browse-jobs" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '13px 32px', borderRadius: '8px', background: '#6366F1',
                color: 'white', border: 'none', fontSize: '15px', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif",
                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >Browse Jobs</button>
            </Link>
            <Link to="/post-job" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '13px 32px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.1)', color: 'white',
                border: '1px solid rgba(255,255,255,0.25)', fontSize: '15px',
                fontWeight: '500', cursor: 'pointer',
                transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              >Post a Job</button>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-preview-wrap { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Home;
