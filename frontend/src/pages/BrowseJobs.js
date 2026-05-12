import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";
import { WalletContext } from "../context/WalletContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const BrowseJobs = () => {
  const { currentAccount } = useContext(WalletContext);
  const { user, token } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);
  const [justAccepted, setJustAccepted] = useState(null); // { jobId, clientId, clientName }
  const [source, setSource] = useState("email");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchEmailJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/jobs?status=Open`);
      setJobs(res.data.map(j => ({ ...j, source: 'email', id: j._id })));
    } catch { showToast('Error loading jobs', 'error'); }
    finally { setLoading(false); }
  };

  const fetchBlockchainJobs = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const count = await contract.jobCount();
      const arr = [];
      for (let i = 0; i < count; i++) {
        const job = await contract.jobs(i);
        if (!job.completed && job.freelancer === ethers.ZeroAddress) {
          arr.push({
            id: job.id.toString(), client: job.client,
            description: job.description,
            payment: ethers.formatEther(job.payment),
            source: 'blockchain',
          });
        }
      }
      setJobs(arr);
    } catch { showToast('Error loading blockchain jobs. Check your network.', 'error'); }
    finally { setLoading(false); }
  };

  const acceptEmailJob = async (jobId, postedBy, postedByName) => {
    if (!user) { showToast('Please log in to accept a job', 'error'); return; }
    try {
      setAccepting(jobId);
      await axios.post(`${process.env.REACT_APP_API_URL}/jobs/${jobId}/accept`,
        { freelancerId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Job accepted! You can now message the client.');
      setJustAccepted({ jobId, clientId: postedBy, clientName: postedByName || 'Client' });
      fetchEmailJobs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error accepting job', 'error');
    } finally { setAccepting(null); }
  };

  const acceptBlockchainJob = async (id) => {
    if (!currentAccount) { showToast('Connect your wallet first', 'error'); return; }
    try {
      setAccepting(id);
      const contract = await getContract();
      const tx = await contract.acceptJob(id);
      await tx.wait();
      showToast('Job accepted on blockchain!');
      fetchBlockchainJobs();
    } catch (err) {
      showToast(err.message || 'Error accepting job', 'error');
    } finally { setAccepting(null); }
  };

  useEffect(() => {
    if (source === 'email') fetchEmailJobs();
    else if (source === 'blockchain' && currentAccount) fetchBlockchainJobs();
    else if (source === 'blockchain') setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, currentAccount]);

  const filtered = jobs.filter(j =>
    (j.title || j.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const SkeletonCard = () => (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '28px' }}>
      {[80, 60, 40, 40].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: '16px', width: `${w}%`, marginBottom: '12px' }} />
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
      {/* Toast */}
      {toast && (
        <div className="toast" style={{ borderLeft: `3px solid ${toast.type === 'error' ? '#FF6584' : '#43E97B'}` }}>
          {toast.type === 'error' ? '⚠️' : '✅'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '40px', animation: 'fadeInUp 0.5s ease-out' }}>
        <h1 className="section-title">Browse Jobs</h1>
        <p className="section-subtitle">Find your next opportunity</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center', animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
        {/* Tab switcher */}
        <div className="tab-group" style={{ flex: '0 0 auto', marginBottom: 0 }}>
          <button className={`tab-btn ${source === 'email' ? 'active' : ''}`} onClick={() => setSource('email')}>
            📧 Email Jobs
          </button>
          <button className={`tab-btn ${source === 'blockchain' ? 'active' : ''}`} onClick={() => setSource('blockchain')}>
            🦊 Blockchain Jobs
          </button>
        </div>

        {/* Search */}
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>🔍</span>
          <input type="text" placeholder="Search jobs..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark" style={{ paddingLeft: '42px' }} />
        </div>

        <button onClick={source === 'email' ? fetchEmailJobs : fetchBlockchainJobs}
          disabled={loading}
          className="btn-outline" style={{ whiteSpace: 'nowrap' }}>
          {loading ? <><div className="spinner" style={{ display: 'inline-block', marginRight: '6px', width: '14px', height: '14px' }} />Loading</> : '↻ Refresh'}
        </button>
      </div>

      {/* Auth warnings */}
      {source === 'email' && !user && (
        <div className="alert alert-warning">⚠️ Please log in to browse and accept email-posted jobs.</div>
      )}
      {source === 'blockchain' && !currentAccount && (
        <div className="alert alert-warning">⚠️ Connect your MetaMask wallet to browse blockchain jobs.</div>
      )}

      {/* Job count */}
      {!loading && (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>
          {filtered.length} job{filtered.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Jobs grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="empty-state-icon">💼</div>
            <div className="empty-state-text">No jobs found</div>
            <div className="empty-state-sub">
              {source === 'email' ? 'Be the first to post a job!' : 'No open blockchain jobs right now.'}
            </div>
          </div>
        ) : (
          filtered.map((job, i) => (
            <div key={job.id} className="job-card" style={{ animationDelay: `${i * 0.05}s`, animation: 'fadeInUp 0.5s ease-out both' }}>
              {/* Source badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span className={`badge ${job.source === 'blockchain' ? 'badge-blockchain' : 'badge-open'}`}>
                  {job.source === 'blockchain' ? '🦊 Blockchain' : '📧 Email'}
                </span>
                {job.source === 'email' && (
                  <span className="badge badge-open">● Open</span>
                )}
              </div>

              {/* Title / Description */}
              {job.title && (
                <h3 style={{ color: 'white', fontSize: '17px', fontWeight: '700', marginBottom: '8px', lineHeight: '1.4' }}>
                  {job.title}
                </h3>
              )}
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                {job.description?.length > 120 ? job.description.slice(0, 120) + '...' : job.description}
              </p>

              <div className="divider" />

              {/* Meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                {job.source === 'email' ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#43E97B', fontSize: '15px', fontWeight: '700' }}>
                      💵 ${job.budget}
                    </div>
                    {job.deadline && (
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        📅 {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    )}
                    {job.postedBy?.name && (
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        👤 {job.postedBy.name}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ color: '#43E97B', fontSize: '15px', fontWeight: '700' }}>
                      ⟠ {job.payment} ETH
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'monospace' }}>
                      {job.client?.slice(0, 8)}...{job.client?.slice(-6)}
                    </div>
                  </>
                )}
              </div>

              {/* Skills */}
              {job.skills?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {job.skills.map(s => (
                    <span key={s} style={{
                      background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)',
                      borderRadius: '6px', padding: '3px 10px', fontSize: '12px', color: '#6C63FF', fontWeight: '600',
                    }}>{s}</span>
                  ))}
                </div>
              )}

              {/* Accept button */}
              {source === 'email' && user && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => acceptEmailJob(job.id, job.postedBy?._id, job.postedBy?.name)}
                    disabled={accepting === job.id}
                    className="btn-accept"
                    style={{ width: '100%' }}
                  >
                    {accepting === job.id
                      ? <><div className="spinner" style={{ display: 'inline-block', marginRight: '6px', width: '14px', height: '14px' }} />Accepting...</>
                      : '✅ Accept Job'}
                  </button>
                  {/* Show Message Client button right after accepting */}
                  {justAccepted?.jobId === job.id && (
                    <Link
                      to="/messages"
                      state={{ receiverId: justAccepted.clientId, receiverName: justAccepted.clientName }}
                      style={{ textDecoration: 'none' }}
                    >
                      <button style={{
                        width: '100%', padding: '10px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #4FACFE, #00F2FE)',
                        color: '#0D0D1A', border: 'none', cursor: 'pointer',
                        fontWeight: '700', fontSize: '14px', transition: 'all 0.2s',
                        animation: 'fadeInUp 0.4s ease-out',
                      }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        💬 Message {justAccepted.clientName?.split(' ')[0] || 'Client'} Now
                      </button>
                    </Link>
                  )}
                </div>
              )}
              {source === 'blockchain' && currentAccount && (
                <button
                  onClick={() => acceptBlockchainJob(job.id)}
                  disabled={accepting === job.id}
                  className="btn-accept"
                  style={{ width: '100%' }}
                >
                  {accepting === job.id ? <><div className="spinner" style={{ display: 'inline-block', marginRight: '6px', width: '14px', height: '14px' }} />Accepting...</> : '⟠ Accept on Blockchain'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
