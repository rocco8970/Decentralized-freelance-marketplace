import React, { useState, useContext } from "react";
import { ethers } from 'ethers';
import { getContract } from "../utils/contract";
import { WalletContext } from "../context/WalletContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const SKILLS = ['React', 'Node.js', 'Solidity', 'Python', 'Design', 'Writing', 'Marketing', 'Data Science', 'Mobile', 'DevOps'];

const PostJob = () => {
  const { currentAccount } = useContext(WalletContext);
  const { user, token } = useContext(AuthContext);
  const [method, setMethod] = useState(user ? "email" : "metamask");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [emailForm, setEmailForm] = useState({ title: '', description: '', budget: '', deadline: '' });
  const [chainForm, setChainForm] = useState({ description: '', amount: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const setE = (k) => (e) => setEmailForm(f => ({ ...f, [k]: e.target.value }));
  const setC = (k) => (e) => setChainForm(f => ({ ...f, [k]: e.target.value }));

  const toggleSkill = (s) => setSelectedSkills(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );

  const postEmailJob = async (e) => {
    e.preventDefault();
    if (!user) { showToast('Please log in first', 'error'); return; }
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/jobs`, {
        ...emailForm,
        budget: parseFloat(emailForm.budget),
        skills: selectedSkills,
        postedBy: user._id,
      }, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Job posted successfully! Freelancers can now apply.');
      setEmailForm({ title: '', description: '', budget: '', deadline: '' });
      setSelectedSkills([]);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error posting job', 'error');
    } finally { setLoading(false); }
  };

  const postChainJob = async (e) => {
    e.preventDefault();
    if (!currentAccount) { showToast('Connect your wallet first', 'error'); return; }
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.postJob(chainForm.description, { value: ethers.parseEther(chainForm.amount) });
      await tx.wait();
      showToast('Job posted on blockchain! ETH locked in escrow.');
      setChainForm({ description: '', amount: '' });
    } catch (err) {
      showToast(err.message || 'Error posting job', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
      {toast && (
        <div className="toast" style={{ borderLeft: `3px solid ${toast.type === 'error' ? '#FF6584' : '#43E97B'}` }}>
          {toast.type === 'error' ? '⚠️' : '✅'} {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: '40px', animation: 'fadeInUp 0.5s ease-out' }}>
        <h1 className="section-title">Post a Job</h1>
        <p className="section-subtitle">Find the perfect freelancer for your project</p>
      </div>

      {/* Method selector */}
      <div className="tab-group" style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
        <button className={`tab-btn ${method === 'email' ? 'active' : ''}`} onClick={() => setMethod('email')}>
          📧 Post via Email
        </button>
        <button className={`tab-btn ${method === 'metamask' ? 'active' : ''}`} onClick={() => setMethod('metamask')}>
          🦊 Post via MetaMask
        </button>
      </div>

      {/* Email Form */}
      {method === 'email' && (
        <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
          {!user ? (
            <div className="alert alert-warning">⚠️ Please log in with email to post a job via this method.</div>
          ) : (
            <form onSubmit={postEmailJob}>
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '32px',
              }}>
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input type="text" placeholder="e.g., Build a DeFi Dashboard" value={emailForm.title}
                    onChange={setE('title')} required disabled={loading} className="input-dark" />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description</label>
                  <textarea placeholder="Describe the project in detail — requirements, deliverables, timeline..."
                    value={emailForm.description} onChange={setE('description')} required disabled={loading}
                    className="input-dark" style={{ minHeight: '140px', resize: 'vertical' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Budget (USD)</label>
                    <input type="number" placeholder="500" value={emailForm.budget}
                      onChange={setE('budget')} required disabled={loading} className="input-dark" min="1" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input type="date" value={emailForm.deadline}
                      onChange={setE('deadline')} disabled={loading} className="input-dark" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Required Skills</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SKILLS.map(s => (
                      <button key={s} type="button" onClick={() => toggleSkill(s)}
                        style={{
                          padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                          border: selectedSkills.includes(s) ? '1px solid rgba(108,99,255,0.6)' : '1px solid rgba(255,255,255,0.1)',
                          background: selectedSkills.includes(s) ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.03)',
                          color: selectedSkills.includes(s) ? '#6C63FF' : 'rgba(255,255,255,0.5)',
                          fontSize: '13px', fontWeight: '600', transition: 'all 0.2s ease',
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-gradient"
                  style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '14px', marginTop: '8px' }}>
                  {loading ? <><div className="spinner" style={{ display: 'inline-block', marginRight: '8px' }} />Posting...</> : '📧 Post Job via Email'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* MetaMask Form */}
      {method === 'metamask' && (
        <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
          {!currentAccount ? (
            <div className="alert alert-warning">⚠️ Connect your MetaMask wallet to post a blockchain job.</div>
          ) : (
            <form onSubmit={postChainJob}>
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '32px',
              }}>
                {/* Info banner */}
                <div style={{
                  background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)',
                  borderRadius: '14px', padding: '16px', marginBottom: '24px',
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '20px' }}>🔒</span>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                      ETH Escrow Protection
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: '1.5' }}>
                      Your ETH will be locked in the smart contract until you mark the job as complete. Fully trustless.
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description</label>
                  <textarea placeholder="Describe the job clearly — what needs to be done, expected output..."
                    value={chainForm.description} onChange={setC('description')} required disabled={loading}
                    className="input-dark" style={{ minHeight: '140px', resize: 'vertical' }} />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Amount (ETH)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                      color: '#43E97B', fontWeight: '700', fontSize: '16px',
                    }}>⟠</span>
                    <input type="text" placeholder="0.05" value={chainForm.amount}
                      onChange={setC('amount')} required disabled={loading}
                      className="input-dark" style={{ paddingLeft: '40px' }} />
                  </div>
                  {chainForm.amount && !isNaN(chainForm.amount) && (
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '6px' }}>
                      ≈ ${(parseFloat(chainForm.amount) * 3200).toFixed(2)} USD (estimated)
                    </div>
                  )}
                </div>

                <div className="wallet-chip" style={{ marginBottom: '20px' }}>
                  <span>🦊</span> {currentAccount.slice(0, 10)}...{currentAccount.slice(-8)}
                </div>

                <button type="submit" disabled={loading} className="btn-gradient"
                  style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '14px' }}>
                  {loading ? <><div className="spinner" style={{ display: 'inline-block', marginRight: '8px' }} />Posting to Blockchain...</> : '🦊 Post Job via MetaMask'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PostJob;
