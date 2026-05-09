import React, { useState, useContext, useEffect } from 'react';
import { WalletContext } from '../context/WalletContext';
import { getContract } from '../utils/contract';
import { ethers } from 'ethers';

const Dashboard = () => {
  const { currentAccount } = useContext(WalletContext);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);

  const fetchMyJobs = async () => {
    if (!currentAccount) return;
    
    try {
      setLoading(true);
      const contract = await getContract();
      const jobCount = await contract.jobCount();
      const jobsArray = [];

      for (let i = 0; i < jobCount; i++) {
        const job = await contract.jobs(i);
        if (job.client.toLowerCase() === currentAccount.toLowerCase() || 
            job.freelancer.toLowerCase() === currentAccount.toLowerCase()) {
          jobsArray.push({
            id: job.id.toString(),
            client: job.client,
            freelancer: job.freelancer,
            description: job.description,
            payment: ethers.formatEther(job.payment),
            completed: job.completed,
            isClient: job.client.toLowerCase() === currentAccount.toLowerCase(),
            isFreelancer: job.freelancer.toLowerCase() === currentAccount.toLowerCase()
          });
        }
      }
      setMyJobs(jobsArray);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const completeJob = async (jobId) => {
    try {
      setCompleting(jobId);
      const contract = await getContract();
      const tx = await contract.completeJob(jobId);
      await tx.wait();
      alert('Job marked as completed!');
      fetchMyJobs();
    } catch (error) {
      console.error("Error completing job:", error);
      alert(error.message || 'Failed to complete job');
    } finally {
      setCompleting(null);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      fetchMyJobs();
    }
  }, [currentAccount]);

  if (!currentAccount) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Dashboard</h2>
        <p>Please connect your wallet to view your jobs.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>My Jobs Dashboard</h2>
      <button onClick={fetchMyJobs} disabled={loading} style={{ marginBottom: '20px' }}>
        {loading ? 'Loading...' : 'Refresh'}
      </button>

      {loading && <p>Loading your jobs...</p>}
      {!loading && myJobs.length === 0 && <p>You don't have any jobs yet.</p>}

      {myJobs.map((job) => (
        <div key={job.id} style={{ 
          border: "1px solid #ddd", 
          borderRadius: '8px',
          margin: '15px 0', 
          padding: '15px',
          backgroundColor: job.completed ? '#e8f5e9' : '#fff3e0'
        }}>
          <p><strong>Job ID:</strong> {job.id}</p>
          <p><strong>Description:</strong> {job.description}</p>
          <p><strong>Payment:</strong> {job.payment} ETH</p>
          <p><strong>Status:</strong> {job.completed ? '✅ Completed' : '⏳ In Progress'}</p>
          <p><strong>Your Role:</strong> {job.isClient ? 'Client' : 'Freelancer'}</p>
          
          {job.isClient && (
            <p><strong>Freelancer:</strong> {job.freelancer === ethers.ZeroAddress ? 'Not assigned' : `${job.freelancer.slice(0, 6)}...${job.freelancer.slice(-4)}`}</p>
          )}
          
          {job.isClient && !job.completed && job.freelancer !== ethers.ZeroAddress && (
            <button 
              onClick={() => completeJob(job.id)}
              disabled={completing === job.id}
              style={{ 
                padding: '8px 16px', 
                cursor: completing === job.id ? 'not-allowed' : 'pointer',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginTop: '10px'
              }}
            >
              {completing === job.id ? 'Completing...' : 'Mark as Complete'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;


