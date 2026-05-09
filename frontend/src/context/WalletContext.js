import React, { createContext, useState, useEffect } from 'react';
import contractAddress from '../contracts/contractAddress';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [walletError, setWalletError] = useState(null);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                setWalletError("MetaMask is not installed. Please install MetaMask to continue.");
                setShowWalletModal(true);
                return;
            }

            setIsConnecting(true);
            setWalletError(null);
            
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                setShowWalletModal(false);
                
                // Show success notification
                console.log("✅ Wallet connected successfully:", accounts[0]);
            }
            
            setIsConnecting(false);
        } catch (error) {
            console.error("Error connecting wallet:", error);
            
            if (error.code === 4001) {
                setWalletError("Connection rejected. Please approve the connection request in MetaMask.");
            } else {
                setWalletError("Failed to connect wallet. Please try again.");
            }
            
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setCurrentAccount(null);
        console.log("🔌 Wallet disconnected");
    };

    const checkWallet = async () => {
        try {
            if (!window.ethereum) return;

            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                console.log("🔗 Auto-connected to wallet:", accounts[0]);
            }
        } catch (error) {
            console.error("Error checking wallet:", error);
        }
    };

    // Auto-connect on page load
    useEffect(() => {
        const autoConnect = async () => {
            if (window.ethereum) {
                await checkWallet();
            }
        };
        
        autoConnect();

        if (window.ethereum) {
            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setCurrentAccount(accounts[0]);
                    console.log("🔄 Account changed:", accounts[0]);
                } else {
                    setCurrentAccount(null);
                    console.log("🔌 All accounts disconnected");
                }
            });

            // Listen for chain changes
            window.ethereum.on('chainChanged', (chainId) => {
                console.log("⛓️ Chain changed:", chainId);
                window.location.reload();
            });

            // Listen for connection
            window.ethereum.on('connect', (connectInfo) => {
                console.log("🔗 Connected to network:", connectInfo);
            });

            // Listen for disconnection
            window.ethereum.on('disconnect', (error) => {
                console.log("🔌 Disconnected:", error);
                setCurrentAccount(null);
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
                window.ethereum.removeAllListeners('connect');
                window.ethereum.removeAllListeners('disconnect');
            }
        };
    }, []);

    return (
        <WalletContext.Provider value={{ 
            currentAccount, 
            connectWallet, 
            disconnectWallet,
            isConnecting, 
            contractAddress,
            showWalletModal,
            setShowWalletModal,
            walletError
        }}>
            {children}
        </WalletContext.Provider>
    );
};