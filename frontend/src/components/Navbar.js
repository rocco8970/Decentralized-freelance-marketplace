import React, { useContext } from 'react';
import { WalletContext } from '../context/WalletContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { currentAccount, connectWallet, disconnectWallet, isConnecting } = useContext(WalletContext);
    const { user, logout } = useContext(AuthContext);

    const navStyle = {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '15px 40px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
    };

    const linkStyle = {
        color: '#333',
        textDecoration: 'none',
        fontWeight: '600',
        padding: '8px 16px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        display: 'inline-block'
    };

    const logoStyle = {
        fontSize: '24px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    };

    const walletButtonStyle = {
        padding: '10px 20px',
        background: currentAccount 
            ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        cursor: isConnecting ? 'not-allowed' : 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    return (
        <nav style={navStyle} className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                <Link to="/" style={logoStyle}>
                    🚀 FreelanceChain
                </Link>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <Link to="/" style={linkStyle} 
                        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                        Home
                    </Link>
                    <Link to="/browse-jobs" style={linkStyle}
                        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                        Browse Jobs
                    </Link>
                    <Link to="/post-job" style={linkStyle}
                        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                        Post Job
                    </Link>
                    <Link to="/dashboard" style={linkStyle}
                        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                        Dashboard
                    </Link>
                    <Link to="/messages" style={linkStyle}
                        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                        Messages
                    </Link>
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                {!currentAccount ? (
                    <button 
                        onClick={connectWallet}
                        disabled={isConnecting}
                        style={walletButtonStyle}
                        onMouseEnter={(e) => !isConnecting && (e.target.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {isConnecting ? (
                            <>
                                <span>Connecting</span>
                                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                            </>
                        ) : (
                            <>
                                <span>🦊</span>
                                <span>Connect Wallet</span>
                            </>
                        )}
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                            borderRadius: '20px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>🔗</span>
                            <span>{currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}</span>
                        </div>
                        <button
                            onClick={disconnectWallet}
                            style={{
                                padding: '8px 16px',
                                background: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#ff5252'}
                            onMouseLeave={(e) => e.target.style.background = '#ff6b6b'}
                        >
                            Disconnect
                        </button>
                    </div>
                )}
                
                {user ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ 
                            color: '#333', 
                            fontWeight: '600',
                            padding: '8px 16px',
                            background: '#f0f0f0',
                            borderRadius: '20px',
                            fontSize: '14px'
                        }}>
                            👤 {user.name}
                        </span>
                        <button 
                            onClick={logout}
                            style={{ 
                                padding: '8px 16px', 
                                background: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#ff5252'}
                            onMouseLeave={(e) => e.target.style.background = '#ff6b6b'}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link to="/login">
                            <button style={{
                                padding: '8px 20px',
                                background: 'transparent',
                                color: '#667eea',
                                border: '2px solid #667eea',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#667eea';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = '#667eea';
                            }}>
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button style={{
                                padding: '8px 20px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                                Register
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
