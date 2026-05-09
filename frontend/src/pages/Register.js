import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        const result = await register(name, email, password);
        setLoading(false);
        
        if (result.success) {
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.message);
        }
    };

    const containerStyle = {
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '24px',
        padding: '50px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        animation: 'fadeIn 0.6s ease-out'
    };

    const titleStyle = {
        fontSize: '32px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '10px',
        textAlign: 'center'
    };

    const inputGroupStyle = {
        marginBottom: '20px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        color: '#333',
        fontWeight: '600',
        fontSize: '14px'
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 18px',
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        background: 'white',
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        width: '100%',
        padding: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '18px',
        fontWeight: '700',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ fontSize: '64px', marginBottom: '15px' }}>🚀</div>
                    <h2 style={titleStyle}>Create Account</h2>
                    <p style={{ color: '#666', fontSize: '15px' }}>Join FreelanceChain today</p>
                </div>

                <form onSubmit={handleRegister}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={inputStyle}
                            disabled={loading}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                            disabled={loading}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            placeholder="Create a password (min 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                            disabled={loading}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={inputStyle}
                            disabled={loading}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            background: '#fee',
                            border: '2px solid #fcc',
                            borderRadius: '10px',
                            color: '#c33',
                            fontSize: '14px',
                            marginBottom: '20px',
                            animation: 'fadeIn 0.3s ease-out'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div style={{
                            padding: '12px 16px',
                            background: '#efe',
                            border: '2px solid #cfc',
                            borderRadius: '10px',
                            color: '#3c3',
                            fontSize: '14px',
                            marginBottom: '20px',
                            animation: 'fadeIn 0.3s ease-out'
                        }}>
                            ✅ {success}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={buttonStyle}
                        onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {loading ? (
                            <>
                                <span>Creating Account</span>
                                <div className="spinner"></div>
                            </>
                        ) : (
                            <span>Create Account</span>
                        )}
                    </button>
                </form>

                <div style={{ 
                    marginTop: '30px', 
                    textAlign: 'center',
                    paddingTop: '25px',
                    borderTop: '1px solid #e0e0e0'
                }}>
                    <p style={{ color: '#666', fontSize: '15px' }}>
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            style={{ 
                                color: '#667eea', 
                                fontWeight: '700',
                                textDecoration: 'none'
                            }}
                        >
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
