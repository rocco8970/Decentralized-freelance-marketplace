import React, { useEffect, useState, useContext } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";
import { WalletContext } from "../context/WalletContext";

const BrowseJobs = () => {
    const { currentAccount } = useContext(WalletContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(null);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const contract = await getContract();
            const jobCount = await contract.jobCount();
            const jobsArray = [];

            for (let i = 0; i < jobCount; i++) {
                const job = await contract.jobs(i);
                if (!job.completed && job.freelancer === ethers.ZeroAddress) {
                    jobsArray.push({
                        id: job.id.toString(),
                        client: job.client,
                        description: job.description,
                        payment: ethers.formatEther(job.payment),
                    });
                }
            }
            setJobs(jobsArray);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            alert("Error loading jobs. Make sure you're connected to the right network.");
        } finally {
            setLoading(false);
        }
    };

    const acceptJob = async (id) => {
        if (!currentAccount) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            setAccepting(id);
            const contract = await getContract();
            const tx = await contract.acceptJob(id);
            await tx.wait();
            alert("Job accepted successfully!");
            fetchJobs();
        } catch (error) {
            console.error("Error accepting job:", error);
            alert(error.message || "Error accepting job!");
        } finally {
            setAccepting(null);
        }
    };

    useEffect(() => {
        if (currentAccount) {
            fetchJobs();
        }
    }, [currentAccount]);

    if (!currentAccount) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Browse Available Jobs</h2>
                <p>Please connect your wallet to browse jobs.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Browse Available Jobs</h2>
            <button onClick={fetchJobs} disabled={loading} style={{ marginBottom: '20px' }}>
                {loading ? 'Loading...' : 'Refresh Jobs'}
            </button>
            
            {loading && <p>Loading jobs...</p>}
            {!loading && jobs.length === 0 && <p>No jobs available right now.</p>}
            
            {jobs.map((job) => (
                <div key={job.id} style={{ 
                    border: "1px solid #ddd", 
                    borderRadius: '8px',
                    margin: '15px 0', 
                    padding: '15px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <p><strong>Job ID:</strong> {job.id}</p>
                    <p><strong>Description:</strong> {job.description}</p>
                    <p><strong>Client:</strong> {job.client.slice(0, 6)}...{job.client.slice(-4)}</p>
                    <p><strong>Payment:</strong> {job.payment} ETH</p>
                    <button 
                        onClick={() => acceptJob(job.id)}
                        disabled={accepting === job.id}
                        style={{ 
                            padding: '8px 16px', 
                            cursor: accepting === job.id ? 'not-allowed' : 'pointer',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        {accepting === job.id ? 'Accepting...' : 'Accept Job'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BrowseJobs;

