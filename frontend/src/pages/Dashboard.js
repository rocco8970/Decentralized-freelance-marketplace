import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { WalletContext } from '../context/WalletContext';
import { AuthContext } from '../context/AuthContext';
import { getContract } from '../utils/contract';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StarRating = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {[1, 2, 3, 4, 5].map(n => (
      <span key={n} onClick={() => onChange && onChange(n)}
        style={{ fontSize: '24px', cursor: onChange ? 'pointer' : 'default', transition: 'transform 0.1s' }}
        onMouseEnter={e => onChange && (e.currentTarget.style.transform = 'scale(1.2)')}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {n <= value ? '⭐' : '☆'}
      </span>
    ))}
  </div>
);

const Dashboard = () => {
  const { currentAccount } = useContext(WalletContext);
  const { user, token } = useContext(AuthContext);
  const [source, setSource] = useState('email');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);
  const [reviewModal, setReviewModal] = useState(null); // { jobId, targetId }
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchEmailJobs = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/jobs`, { headers: { Authorization: `Bearer ${token}` } });
      const mine = res.data.filter(j => j.postedBy?._id === user._id || j.acceptedBy?._id === user._id);
      setJobs(mine.map(j => ({
        ...j, id: j._id, source: 'email',
        isEmployer: j.postedBy?._id === user._id,
        isFreelancer: j.acceptedBy?._id === user._id,
      })));
    } catch { showToast('Error loading jobs', 'error'); }
    finally { setLoading(false); }
  };

  const fetchBlockchainJobs = async () => {
    if (!currentAccount) return;
    try {
      setLoading(true);
      const contract = await getContract();
      const count = await contract.jobCount();
      const arr = [];
      for (let i = 0; i < count; i++) {
        const job = await contract.jobs(i);
        const isClient = job.client.toLowerCase() === currentAccount.toLowerCase();
        const isFreelancer = job.freelancer.toLowerCase() === currentAccount.toLowerCase();
        if (isClient || isFreelancer) {
          arr.push({
            id: job.id.toString(), client: job.client, freelancer: job.freelancer,
            description: job.description, payment: ethers.formatEther(job.payment),
            completed: job.completed, source: 'blockchain', isClient, isFreelancer,
            status: job.completed ? 'Completed' : job.freelancer === ethers.ZeroAddress ? 'Open' : 'Accepted',
          });
        }
      }
      setJobs(arr);
    } catch { showToast('Error loading blockchain jobs', 'error'); }
    finally { setLoading(false); }
  };

  const completeEmailJob = async (jobId) => {
    try {
      setCompleting(jobId);
      await axios.post(`${API_URL}/jobs/${jobId}/complete`, {}, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Job marked as complete!');
      fetchEmailJobs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to complete job', 'error');
    } finally { setCompleting(null); }
  };

  const completeBlockchainJob = async (jobId) => {
    try {
      setCompleting(jobId);
      const contract = await getContract();
      const tx = await contract.completeJob(jobId);
      await tx.wait();
      showToast('Job completed! Payment released to freelancer.');
      fetchBlockchainJobs();
    } catch (err) {
      showToast(err.message || 'Failed to complete job', 'error');
    } finally { setCompleting(null); }
  };

  const submitReview = async () => {
    if (!reviewForm.comment.trim()) { showToast('Please write a comment', 'error'); return; }
    try {
      await axios.post(`${API_URL}/reviews`, {
        jobId: reviewModal.jobId,
        targetUserId: reviewModal.targetId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      }, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Review posted successfully!');
      setReviewModal(null);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to post review', 'error');
    }
  };

  useEffect(() => {
    if (source === 'email') fetchEmailJobs();
    else if (source === 'blockchain') fetchBlockchainJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, user, currentAccount]);

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'Open').length,
    active: jobs.filter(j => j.status === 'Accepted').length,
    completed: jobs.filter(j => j.status === 'Completed').length,
  };

  const statusBadge = { Open: 'badge-open', Accepted: 'badge-accepted', Completed: 'badge-completed' };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
      {toast && (
        <div className="toast" style={{ borderLeft: `3px solid ${toast.type === 'error' ? '#FF6584' : '#43E97B'}` }}>
          {toast.type === 'error' ? '⚠️' : '✅'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '16px', animation: 'fadeInUp 0.5s ease-out' }}>
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">
            {user ? `Welcome back, ${user.name?.split(' ')[0]}!` : 'Your job overview'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/post-job" style={{ textDecoration: 'none' }}>
            <button className="btn-gradient" style={{ padding: '10px 22px', fontSize: '14px' }}>+ Post Job</button>
          </Link>
          <Link to="/browse-jobs" style={{ textDecoration: 'none' }}>
            <button className="btn-outline" style={{ padding: '10px 22px', fontSize: '14px' }}>Browse Jobs</button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px', animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
        {[
          { label: 'Total Jobs', value: stats.total, icon: '💼', color: '#6C63FF' },
          { label: 'Open', value: stats.open, icon: '🟢', color: '#43E97B' },
          { label: 'In Progress', value: stats.active, icon: '⚡', color: '#4FACFE' },
          { label: 'Completed', value: stats.completed, icon: '✅', color: '#FF6584' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div className="stat-number" style={{ fontSize: '28px' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Source tabs */}
      <div className="tab-group" style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
        <button className={`tab-btn ${source === 'email' ? 'active' : ''}`} onClick={() => setSource('email')}>
          📧 Email Jobs
        </button>
        <button className={`tab-btn ${source === 'blockchain' ? 'active' : ''}`} onClick={() => setSource('blockchain')}>
          🦊 Blockchain Jobs
        </button>
      </div>

      {/* Auth warnings */}
      {source === 'email' && !user && (
        <div className="alert alert-warning">⚠️ Please log in to view your email-based jobs.</div>
      )}
      {source === 'blockchain' && !currentAccount && (
        <div className="alert alert-warning">⚠️ Connect your wallet to view blockchain jobs.</div>
      )}

      {/* Jobs list */}
      {loading ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '28px' }}>
              {[70, 50, 40].map((w, j) => (
                <div key={j} className="skeleton" style={{ height: '16px', width: `${w}%`, marginBottom: '12px' }} />
              ))}
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <div className="empty-state-text">No jobs yet</div>
          <div className="empty-state-sub">Post a job or browse available opportunities</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <Link to="/post-job" style={{ textDecoration: 'none' }}>
              <button className="btn-gradient" style={{ padding: '12px 24px' }}>Post a Job</button>
            </Link>
            <Link to="/browse-jobs" style={{ textDecoration: 'none' }}>
              <button className="btn-outline" style={{ padding: '12px 24px' }}>Browse Jobs</button>
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {jobs.map((job, i) => (
            <div key={job.id} className="job-card" style={{ animationDelay: `${i * 0.05}s`, animation: 'fadeInUp 0.5s ease-out both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    {job.title && <h3 style={{ color: '#111827', fontSize: '17px', fontWeight: '700' }}>{job.title}</h3>}
                    <span className={`badge ${statusBadge[job.status] || 'badge-open'}`}>
                      {job.status}
                    </span>
                    <span style={{
                      background: '#F3F4F6', borderRadius: '6px', padding: '3px 10px',
                      fontSize: '12px', color: '#6B7280', border: '1px solid #E5E7EB',
                    }}>
                      {job.isEmployer || job.isClient ? '👔 Client' : '👨‍💻 Freelancer'}
                    </span>
                  </div>
                  <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
                    {job.description?.length > 150 ? job.description.slice(0, 150) + '...' : job.description}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {job.source === 'email' ? (
                    <div style={{ color: '#16A34A', fontSize: '20px', fontWeight: '800' }}>${job.budget}</div>
                  ) : (
                    <div style={{ color: '#16A34A', fontSize: '20px', fontWeight: '800' }}>⟠ {job.payment} ETH</div>
                  )}
                </div>
              </div>

              {/* Parties */}
              {source === 'blockchain' && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <div style={{ color: '#6B7280', fontSize: '12px', fontFamily: 'monospace' }}>
                    Client: {job.client?.slice(0, 8)}...{job.client?.slice(-6)}
                  </div>
                  {job.freelancer && job.freelancer !== ethers.ZeroAddress && (
                    <div style={{ color: '#6B7280', fontSize: '12px', fontFamily: 'monospace' }}>
                      Freelancer: {job.freelancer?.slice(0, 8)}...{job.freelancer?.slice(-6)}
                    </div>
                  )}
                </div>
              )}

              {source === 'email' && (job.postedBy || job.acceptedBy) && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {job.postedBy?.name && (
                    <div style={{ color: '#6B7280', fontSize: '13px' }}>
                      👔 Client: {job.postedBy.name}
                    </div>
                  )}
                  {job.acceptedBy?.name && (
                    <div style={{ color: '#6B7280', fontSize: '13px' }}>
                      👨‍💻 Freelancer: {job.acceptedBy.name}
                    </div>
                  )}
                </div>
              )}

              <div className="divider" />

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Complete button */}
                {job.status === 'Accepted' && (job.isEmployer || job.isClient) && (
                  <button
                    onClick={() => source === 'email' ? completeEmailJob(job.id) : completeBlockchainJob(job.id)}
                    disabled={completing === job.id}
                    className="btn-complete"
                  >
                    {completing === job.id
                      ? <><div className="spinner" style={{ display: 'inline-block', marginRight: '6px', width: '14px', height: '14px' }} />Completing...</>
                      : '✅ Mark Complete'}
                  </button>
                )}

                {/* Message button — passes the other person's ID directly */}
                {job.status === 'Accepted' && source === 'email' && (
                  <Link
                    to="/messages"
                    state={{
                      receiverId: job.isEmployer ? job.acceptedBy?._id : job.postedBy?._id,
                      receiverName: job.isEmployer ? job.acceptedBy?.name : job.postedBy?.name,
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    <button className="btn-outline" style={{ padding: '10px 18px' }}>
                      💬 Message {job.isEmployer ? job.acceptedBy?.name?.split(' ')[0] || 'Freelancer' : job.postedBy?.name?.split(' ')[0] || 'Client'}
                    </button>
                  </Link>
                )}

                {/* Review button */}
                {job.status === 'Completed' && source === 'email' && (
                  <button
                    onClick={() => setReviewModal({
                      jobId: job.id,
                      targetId: job.isEmployer ? job.acceptedBy?._id : job.postedBy?._id,
                    })}
                    style={{
                      background: 'rgba(254,225,64,0.1)', border: '1px solid rgba(254,225,64,0.3)',
                      borderRadius: '10px', padding: '10px 18px', color: '#FEE140',
                      cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(254,225,64,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(254,225,64,0.1)'}
                  >
                    ⭐ Leave Review
                  </button>
                )}

                {job.status === 'Completed' && (
                  <span style={{ color: '#16A34A', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ✅ Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#111827', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>⭐ Leave a Review</h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '28px' }}>
              Share your experience to help the community.
            </p>

            <div className="form-group">
              <label className="form-label">Rating</label>
              <StarRating value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Your Review</label>
              <textarea
                placeholder="Describe your experience working with this person..."
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                className="input-dark"
                style={{ minHeight: '120px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={submitReview} className="btn-gradient" style={{ flex: 1, padding: '14px' }}>
                Submit Review
              </button>
              <button onClick={() => setReviewModal(null)} className="btn-outline" style={{ flex: 1, padding: '14px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
