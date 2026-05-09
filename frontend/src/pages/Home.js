import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../context/WalletContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { currentAccount, connectWallet, isConnecting, walletError, showWalletModal, setShowWalletModal } = useContext(WalletContext);
    const [showFeatures, setShowFeatures] = useState(false);

    useEffect(() => {
        setTimeout(() => setShowFeatures(true), 300);
    }, []);

    const containerStyle = {
        minHeight: 'calc(100vh - 80px)',
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
    };

    const heroStyle = {
        textAlign: 'center',
        marginBottom: '80px',
        animation: 'fadeIn 0.8s ease-out'
    };

    const titleStyle = {
        fontSize: '56px',
        fontWeight: '800',
        color: 'white',
        marginBottom: '20px',
        textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        lineHeight: '1.2'
    };

    const subtitleStyle = {
        fontSize: '22px',
        color: 'rgba(255, 255, 255, 0.95)',
        marginBottom: '40px',
        maxWidth: '700px',
        margin: '0 auto 40px',
        lineHeight: '1.6',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        marginBottom: '40px',
        animation: 'fadeIn 0.8s ease-out'
    };

    const featureGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        marginTop: '60px'
    };

    const featureCardStyle = {
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    };

    const buttonStyle = {
        padding: '16px 40px',
        fontSize: '18px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        cursor: isConnecting ? 'not-allowed' : 'pointer',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px'
    };

    const actionButtonStyle = {
        padding: '14px 28px',
        fontSize: '16px',
        fontWeight: '600',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
        color: 'white'
    };

    return (
        <div style={containerStyle}>
            {/* Hero Section */}
            <div style={heroStyle} className="fade-in">
                <h1 style={titleStyle}>
                    Welcome to FreelanceChain 🚀
                </h1>
                <p style={subtitleStyle}>
                    The future of freelancing is here. Connect your wallet, post jobs, and get paid securely with blockchain technology.
                </p>
                
                {/* Wallet Connection Card */}
                <div style={cardStyle}>
                    {!currentAccount ? (
                        <div>
                            <div style={{ marginBottom: '30px' }}>
                                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🦊</div>
                                <h2 style={{ color: '#333', marginBottom: '15px' }}>Connect Your MetaMask Wallet</h2>
                                <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px' }}>
                                    Get started by connecting your MetaMask wallet to access all features
                                </p>
                            </div>
                            
                            <button 
                                onClick={connectWallet}
                                disabled={isConnecting}
                                style={buttonStyle}
                                onMouseEnter={(e) => !isConnecting && (e.target.style.transform = 'translateY(-3px)')}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                {isConnecting ? (
                                    <>
                                        <span>Connecting to MetaMask</span>
                                        <div className="spinner"></div>
                                    </>
                                ) : (
                                    <>
                                        <span>🦊</span>
                                        <span>Connect MetaMask Wallet</span>
                                    </>
                                )}
                            </button>

                            {walletError && (
                                <div style={{
                                    marginTop: '20px',
                                    padding: '15px',
                                    background: '#fee',
                                    border: '2px solid #fcc',
                                    borderRadius: '12px',
                                    color: '#c33',
                                    fontSize: '14px'
                                }}>
                                    ⚠️ {walletError}
                                </div>
                            )}

                            <div style={{ marginTop: '30px', fontSize: '14px', color: '#999' }}>
                                <p>Don't have MetaMask? <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', fontWeight: '600' }}>Download here</a></p>
                            </div>
                        </div>
                    ) : (
                        <div className="fade-in">
                            <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
                            <h2 style={{ color: '#11998e', marginBottom: '15px' }}>Wallet Connected!</h2>
                            <div style={{
                                display: 'inline-block',
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                borderRadius: '25px',
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: '600',
                                marginBottom: '30px'
                            }}>
                                🔗 {currentAccount.slice(0, 8)}...{currentAccount.slice(-6)}
                            </div>
                            
                            <div style={{ 
                                display: 'flex', 
                                gap: '20px', 
                                justifyContent: 'center', 
                                flexWrap: 'wrap',
                                marginTop: '30px'
                            }}>
                                <Link to="/post-job">
                                    <button 
                                        style={{ 
                                            ...actionButtonStyle,
                                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        💼 Post a Job
                                    </button>
                                </Link>
                                <Link to="/browse-jobs">
                                    <button 
                                        style={{ 
                                            ...actionButtonStyle,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        🔍 Browse Jobs
                                    </button>
                                </Link>
                                <Link to="/dashboard">
                                    <button 
                                        style={{ 
                                            ...actionButtonStyle,
                                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        📊 My Dashboard
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Section */}
            {showFeatures && (
                <div style={featureGridStyle} className="fade-in">
                    {[
                        { icon: '🔒', title: 'Secure Payments', desc: 'Smart contract-based escrow ensures safe transactions' },
                        { icon: '⚡', title: 'Instant Settlements', desc: 'Get paid immediately upon job completion' },
                        { icon: '🌍', title: 'Global Access', desc: 'Work with clients and freelancers worldwide' },
                        { icon: '💎', title: 'Low Fees', desc: 'Minimal transaction costs with blockchain' },
                        { icon: '🤝', title: 'Direct Connection', desc: 'No middleman between clients and freelancers' },
                        { icon: '📈', title: 'Transparent', desc: 'All transactions recorded on the blockchain' }
                    ].map((feature, index) => (
                        <div 
                            key={index}
                            style={{
                                ...featureCardStyle,
                                animationDelay: `${index * 0.1}s`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>{feature.icon}</div>
                            <h3 style={{ color: '#333', marginBottom: '10px', fontSize: '20px' }}>{feature.title}</h3>
                            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.6' }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* MetaMask Installation Modal */}
            {showWalletModal && !window.ethereum && (
                <div className="modal-overlay" onClick={() => setShowWalletModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '20px', color: '#333' }}>🦊 MetaMask Required</h2>
                        <p style={{ marginBottom: '30px', color: '#666', lineHeight: '1.6' }}>
                            MetaMask is a crypto wallet that allows you to interact with blockchain applications. 
                            Please install MetaMask to continue.
                        </p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <a 
                                href="https://metamask.io/download/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                            >
                                <button className="btn btn-primary">
                                    Download MetaMask
                                </button>
                            </a>
                            <button 
                                className="btn"
                                style={{ background: '#e0e0e0', color: '#333' }}
                                onClick={() => setShowWalletModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;

