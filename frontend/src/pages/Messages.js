import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Messages = () => {
    const { user } = useContext(AuthContext);
    const [receiverId, setReceiverId] = useState("");
    const [content, setContent] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const fetchMessages = async () => {
        if (!receiverId || !user) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/messages/${user._id}/${receiverId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!content.trim() || !user) return;

        try {
            setSending(true);
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/messages/send`, {
                senderId: user._id,
                receiverId,
                content
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContent("");
            fetchMessages();
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        if (receiverId && user) {
            fetchMessages();
        }
    }, [receiverId, user]);

    if (!user) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Messages</h2>
                <p>Please login to access messages.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
            <h2>Messages</h2>
            <div style={{ marginBottom: '20px' }}>
                <label>Receiver User ID:</label><br />
                <input
                    type="text"
                    placeholder="Enter receiver's user ID"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
            </div>

            {receiverId && (
                <>
                    <div style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        padding: '15px',
                        minHeight: '300px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        backgroundColor: '#f9f9f9',
                        marginBottom: '20px'
                    }}>
                        {loading && <p>Loading messages...</p>}
                        {!loading && messages.length === 0 && <p>No messages yet. Start the conversation!</p>}
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                style={{ 
                                    marginBottom: 15,
                                    padding: '10px',
                                    borderRadius: '6px',
                                    backgroundColor: msg.senderId === user._id ? '#d1e7ff' : '#fff',
                                    textAlign: msg.senderId === user._id ? 'right' : 'left'
                                }}
                            >
                                <strong>{msg.senderId === user._id ? "You" : "Them"}:</strong> {msg.content}
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                    {new Date(msg.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={sendMessage}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{ flex: 1, padding: '10px' }}
                                disabled={sending}
                            />
                            <button 
                                type="submit"
                                disabled={sending || !content.trim()}
                                style={{ 
                                    padding: '10px 20px',
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: sending || !content.trim() ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {sending ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default Messages;
