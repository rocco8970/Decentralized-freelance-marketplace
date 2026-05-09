import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await login(email, password);
        setLoading(false);
        
        if (result.success) {
            navigate('/dashboard');
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
        marginBottom: '25px'
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
                    <div style={{ fontSize: '64px', marginBottom: '15px' }}>🔐</div>
                    <h2 style={titleStyle}>Welcome Back!</h2>
                    <p style={{ color: '#666', fontSize: '15px' }}>Login to access your account</p>
                </div>

                <form onSubmit={handleLogin}>
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={buttonStyle}
                        onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {loading ? (
                            <>
                                <span>Logging in</span>
                                <div className="spinner"></div>
                            </>
                        ) : (
                            <span>Login</span>
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
                        Don't have an account?{' '}
                        <Link 
                            to="/register" 
                            style={{ 
                                color: '#667eea', 
                                fontWeight: '700',
                                textDecoration: 'none'
                            }}
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
