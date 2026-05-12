import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";
import { WalletContext } from "../context/WalletContext";
import { AuthContext } from "../context/AuthContext";

const BrowseJobs = () => {
    const { currentAccount } = useContext(WalletContext);
    const { user, token } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(null);
    const [source, setSource] = useState(user ? "email" : "blockchain");

    // Fetch jobs from Backend API (Email-posted jobs)
    const fetchEmailJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/jobs`
            );
            
            const jobsWithSource = response.data.map(job => ({
                ...job,
                source: "email",
                id: job._id
            }));
            
            setJobs(jobsWithSource);
        } catch (error) {
            console.error("Error fetching email jobs:", error);
            alert("Error loading jobs from backend");
        } finally {
            setLoading(false);
        }
    };

    // Fetch jobs from Blockchain (MetaMask-posted jobs)
    const fetchBlockchainJobs = async () => {
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
                        source: "blockchain"
                    });
                }
            }
            setJobs(jobsArray);
        } catch (error) {
            console.error("Error fetching blockchain jobs:", error);
            alert("Error loading jobs. Make sure you're connected to the right network.");
        } finally {
            setLoading(false);
        }
    };

    // Accept Email-posted job
    const acceptEmailJob = async (jobId) => {
        if (!user) {
            alert("Please log in to accept a job!");
            return;
        }

        try {
            setAccepting(jobId);
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/jobs/${jobId}/accept`,
                { freelancerId: user._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            alert("Job accepted successfully!");
            fetchEmailJobs();
        } catch (error) {
            console.error("Error accepting job:", error);
            alert(error.response?.data?.message || "Error accepting job!");
        } finally {
            setAccepting(null);
        }
    };

    // Accept Blockchain job
    const acceptBlockchainJob = async (id) => {
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
            fetchBlockchainJobs();
        } catch (error) {
            console.error("Error accepting job:", error);
            alert(error.message || "Error accepting job!");
        } finally {
            setAccepting(null);
        }
    };

    useEffect(() => {
        if (source === "email") {
            fetchEmailJobs();
        } else if (source === "blockchain" && currentAccount) {
            fetchBlockchainJobs();
        } else if (source === "blockchain" && !currentAccount) {
            setLoading(false);
        }
    }, [source, currentAccount]);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Browse Available Jobs</h2>
            
            {/* Source Selection */}
            {user && currentAccount && (
                <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                    <p><strong>View jobs from:</strong></p>
                    <label>
                        <input
                            type="radio"
                            value="email"
                            checked={source === "email"}
                            onChange={(e) => setSource(e.target.value)}
                        />
                        📧 Email-posted jobs (Backend)
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            value="blockchain"
                            checked={source === "blockchain"}
                            onChange={(e) => setSource(e.target.value)}
                        />
                        🦊 Blockchain jobs (MetaMask)
                    </label>
                </div>
            )}

            {/* Email Source */}
            {source === "email" && (
                <>
                    {!user && (
                        <p style={{ color: 'red' }}>Please log in to browse email-posted jobs.</p>
                    )}
                    {user && (
                        <>
                            <button 
                                onClick={fetchEmailJobs} 
                                disabled={loading} 
                                style={{ marginBottom: '20px', padding: '10px 20px' }}
                            >
                                {loading ? 'Loading...' : 'Refresh Jobs'}
                            </button>
                            
                            {loading && <p>Loading jobs...</p>}
                            {!loading && jobs.length === 0 && <p>No email-posted jobs available right now.</p>}
                            
                            {jobs.map((job) => (
                                <div key={job.id} style={{ 
                                    border: "1px solid #ddd", 
                                    borderRadius: '8px',
                                    margin: '15px 0', 
                                    padding: '15px',
                                    backgroundColor: '#f9f9f9'
                                }}>
                                    <p><strong>Title:</strong> {job.title || "Untitled"}</p>
                                    <p><strong>Description:</strong> {job.description}</p>
                                    <p><strong>Budget:</strong> ${job.budget}</p>
                                    <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
                                    <p><strong>Posted by:</strong> {job.postedBy?.username || "Unknown"}</p>
                                    <button 
                                        onClick={() => acceptEmailJob(job.id)}
                                        disabled={accepting === job.id || job.status === "Accepted"}
                                        style={{ 
                                            padding: '8px 15px',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: accepting === job.id ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {accepting === job.id ? 'Accepting...' : job.status === "Accepted" ? 'Already Accepted' : 'Accept Job'}
                                    </button>
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}

            {/* Blockchain Source */}
            {source === "blockchain" && (
                <>
                    {!currentAccount && (
                        <p style={{ color: 'red' }}>Please connect your wallet to browse blockchain jobs.</p>
                    )}
                    {currentAccount && (
                        <>
                            <button 
                                onClick={fetchBlockchainJobs} 
                                disabled={loading} 
                                style={{ marginBottom: '20px', padding: '10px 20px' }}
                            >
                                {loading ? 'Loading...' : 'Refresh Jobs'}
                            </button>
                            
                            {loading && <p>Loading jobs...</p>}
                            {!loading && jobs.length === 0 && <p>No blockchain jobs available right now.</p>}
                            
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
                                        onClick={() => acceptBlockchainJob(job.id)}
                                        disabled={accepting === job.id}
                                        style={{ 
                                            padding: '8px 15px',
                                            backgroundColor: '#FF6B35',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: accepting === job.id ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {accepting === job.id ? 'Accepting...' : 'Accept Job'}
                                    </button>
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default BrowseJobs;

