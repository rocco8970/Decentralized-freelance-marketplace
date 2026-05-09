import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import FreelanceMarketplaceABI from './contracts/FreelanceMarketplaceABI.json';
import FreelanceMarketplaceAddress from './contracts/FreelanceMarketplaceAddress.json';

const App = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  // Connect MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(_provider);

      const signer = _provider.getSigner();
      const contractInstance = new ethers.Contract(
        FreelanceMarketplaceAddress.address,
        FreelanceMarketplaceABI,
        signer
      );
      setContract(contractInstance);

      console.log("Connected Account:", accounts[0]);
      console.log("Contract:", contractInstance);
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div>
      <h2>Decentralized Freelance Marketplace</h2>
      {account ? (
        <p>Connected as: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default App;
