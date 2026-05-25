import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const generateEmailTemplate = (senderName, content) => `Hi there,

You have a new message from ${senderName} on FreelanceChain.

---
"${content}"
---

Reply directly in the FreelanceChain app to continue the conversation.

Best regards,
The FreelanceChain Team`;

const Messages = () => {
  const { user, token } = useContext(AuthContext);
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatId, setNewChatId] = useState('');
  const [newChatName, setNewChatName] = useState('');
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailPreview, setEmailPreview] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (location.state?.receiverId) {
      openConversation(location.state.receiverId, location.state.receiverName || 'User');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openConversation = async (otherId, otherName) => {
    if (!otherId || !user) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/messages/${user._id}/${otherId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      setActiveConv({ id: otherId, name: otherName });
      setConversations(prev => {
        const exists = prev.find(c => c.id === otherId);
        if (exists) return prev;
        return [{ id: otherId, name: otherName, lastMessage: '', time: new Date() }, ...prev];
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() || !activeConv || !user) return;
    const msgText = content;
    setContent('');
    setSending(true);
    try {
      const res = await axios.post(`${API_URL}/messages/send`, {
        receiverId: activeConv.id,
        content: msgText
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(prev => [...prev, res.data]);
      setConversations(prev =>
        prev.map(c => c.id === activeConv.id ? { ...c, lastMessage: msgText, time: new Date() } : c)
      );
    } catch (err) {
      console.error(err);
      setContent(msgText);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const previewEmail = () => {
    if (!content.trim()) return;
    setEmailPreview(generateEmailTemplate(user?.name || 'A user', content));
    setShowEmailPreview(true);
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString();
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '500px', margin: '100px auto', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>💬</div>
        <h2 style={{ color: '#111827', fontSize: '24px', marginBottom: '12px' }}>Messages</h2>
        <p style={{ color: '#6B7280' }}>Please log in to access your messages.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.5s ease-out' }}>
        <h1 className="section-title">Messages</h1>
        <p className="section-subtitle">Chat with clients and freelancers</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '20px',
        height: '600px',
        animation: 'fadeInUp 0.5s ease-out 0.1s both',
      }}>

        {/* Sidebar */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Sidebar header */}
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#111827', fontWeight: '700', fontSize: '15px' }}>
              💬 Chats {conversations.length > 0 && <span style={{ color: '#9CA3AF', fontWeight: '400', fontSize: '13px' }}>({conversations.length})</span>}
            </span>
            <button onClick={() => setShowNewChat(true)} style={{
              background: '#EEF2FF', border: '1px solid #C7D2FE',
              borderRadius: '8px', padding: '6px 12px', color: '#4F46E5',
              cursor: 'pointer', fontSize: '12px', fontWeight: '700', transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
              onMouseLeave={e => e.currentTarget.style.background = '#EEF2FF'}
            >+ New</button>
          </div>

          {/* Conversation list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>💬</div>
                <div style={{ fontSize: '13px', marginBottom: '6px', color: '#6B7280' }}>No conversations yet</div>
                <div style={{ fontSize: '12px' }}>Accept a job or start a new chat</div>
              </div>
            ) : (
              conversations.map(conv => (
                <div key={conv.id}
                  onClick={() => openConversation(conv.id, conv.name)}
                  style={{
                    padding: '14px 20px', cursor: 'pointer', transition: 'all 0.2s',
                    background: activeConv?.id === conv.id ? '#EEF2FF' : 'transparent',
                    borderLeft: activeConv?.id === conv.id ? '3px solid #4F46E5' : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (activeConv?.id !== conv.id) e.currentTarget.style.background = '#F9FAFB'; }}
                  onMouseLeave={e => { if (activeConv?.id !== conv.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#111827', fontWeight: '600', fontSize: '14px' }}>{conv.name}</span>
                    <span style={{ color: '#9CA3AF', fontSize: '11px' }}>{formatTime(conv.time)}</span>
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.lastMessage || 'Start the conversation...'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {!activeConv ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.4 }}>💬</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>No conversation selected</div>
              <div style={{ fontSize: '14px', marginBottom: '28px', maxWidth: '300px', lineHeight: '1.6', color: '#6B7280' }}>
                Select a chat from the left, or go to your Dashboard and click <strong style={{ color: '#374151' }}>"💬 Message"</strong> on an accepted job.
              </div>
              <button onClick={() => setShowNewChat(true)} className="btn-gradient" style={{ padding: '12px 28px' }}>
                + Start New Chat
              </button>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #EC4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: '800', fontSize: '17px', flexShrink: 0,
                }}>
                  {activeConv.name[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#111827', fontWeight: '700', fontSize: '15px' }}>{activeConv.name}</div>
                  <div style={{ color: '#16A34A', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
                    Active now
                  </div>
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '12px', fontFamily: 'monospace' }}>
                  ID: {activeConv.id?.slice(0, 8)}...
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#F9FAFB' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>
                    <div className="spinner" style={{ margin: '0 auto 12px', width: '24px', height: '24px' }} />
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>👋</div>
                    <div style={{ fontSize: '15px', color: '#6B7280', marginBottom: '6px' }}>Say hello!</div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>This is the start of your conversation with <strong style={{ color: '#374151' }}>{activeConv.name}</strong></div>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMine = msg.senderId === user._id || msg.senderId?._id === user._id;
                    const showDate = i === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[i - 1]?.createdAt).toDateString();
                    return (
                      <React.Fragment key={i}>
                        {showDate && (
                          <div style={{ textAlign: 'center', margin: '8px 0' }}>
                            <span style={{ background: '#E5E7EB', borderRadius: '20px', padding: '4px 14px', fontSize: '11px', color: '#6B7280' }}>
                              {new Date(msg.createdAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '8px' }}>
                          {!isMine && (
                            <div style={{
                              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                              background: 'linear-gradient(135deg, #6366F1, #EC4899)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontSize: '12px', fontWeight: '700',
                            }}>
                              {activeConv.name[0]?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className={`msg-bubble ${isMine ? 'sent' : 'received'}`}>
                              {msg.content}
                            </div>
                            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', textAlign: isMine ? 'right' : 'left', paddingLeft: '4px', paddingRight: '4px' }}>
                              {formatTime(msg.createdAt)}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid #E5E7EB', background: '#FFFFFF' }}>
                <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={`Message ${activeConv.name}...`}
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      disabled={sending}
                      className="input-dark"
                      style={{ paddingRight: '48px' }}
                    />
                    <button type="button" onClick={previewEmail} title="Preview as email"
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: content.trim() ? 0.7 : 0.3, transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = content.trim() ? '0.7' : '0.3'}
                    >📧</button>
                  </div>
                  <button type="submit" disabled={sending || !content.trim()}
                    style={{
                      background: content.trim() ? '#4F46E5' : '#E5E7EB',
                      border: 'none', borderRadius: '8px', padding: '10px 20px',
                      color: content.trim() ? 'white' : '#9CA3AF',
                      cursor: content.trim() ? 'pointer' : 'not-allowed',
                      fontWeight: '600', fontSize: '14px', transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap', minWidth: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={e => { if (content.trim()) e.currentTarget.style.background = '#4338CA'; }}
                    onMouseLeave={e => { if (content.trim()) e.currentTarget.style.background = '#4F46E5'; }}
                  >
                    {sending ? <div className="spinner" style={{ width: '16px', height: '16px' }} /> : <>Send ➤</>}
                  </button>
                </form>
                <div style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '8px' }}>
                  Press Enter to send · 📧 to preview as email notification
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="modal-overlay" onClick={() => setShowNewChat(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#111827', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>💬 Start New Chat</h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
              Enter the <strong style={{ color: '#374151' }}>User ID</strong> of the person you want to message.<br />
              You can find it in their job listing or your Dashboard.
            </p>
            <div className="form-group">
              <label className="form-label">User ID</label>
              <input type="text" placeholder="e.g. 6641f3a2b4e1c2d3e4f56789"
                value={newChatId} onChange={e => setNewChatId(e.target.value)}
                className="input-dark" autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Their Name (optional)</label>
              <input type="text" placeholder="e.g. John Doe"
                value={newChatName} onChange={e => setNewChatName(e.target.value)}
                className="input-dark" />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={() => {
                  if (newChatId.trim()) {
                    openConversation(newChatId.trim(), newChatName.trim() || 'User');
                    setShowNewChat(false);
                    setNewChatId('');
                    setNewChatName('');
                  }
                }}
                className="btn-gradient" style={{ flex: 1, padding: '13px' }}
                disabled={!newChatId.trim()}
              >
                Open Chat
              </button>
              <button onClick={() => setShowNewChat(false)} className="btn-outline" style={{ flex: 1, padding: '13px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div className="modal-overlay" onClick={() => setShowEmailPreview(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#111827', fontSize: '18px', fontWeight: '700' }}>📧 Email Notification Preview</h3>
              <button onClick={() => setShowEmailPreview(false)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '22px', lineHeight: 1 }}>×</button>
            </div>
            <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '16px' }}>
              This is how your message would appear as an email to the recipient:
            </p>
            <div style={{
              background: '#F9FAFB', border: '1px solid #E5E7EB',
              borderRadius: '8px', padding: '20px',
              fontFamily: 'monospace', fontSize: '13px', color: '#374151',
              whiteSpace: 'pre-wrap', lineHeight: '1.7', maxHeight: '280px', overflowY: 'auto',
            }}>
              {emailPreview}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => { setShowEmailPreview(false); sendMessage({ preventDefault: () => {} }); }}
                className="btn-gradient" style={{ flex: 1, padding: '13px' }}>
                ✅ Send Message
              </button>
              <button onClick={() => setShowEmailPreview(false)} className="btn-outline" style={{ flex: 1, padding: '13px' }}>
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
