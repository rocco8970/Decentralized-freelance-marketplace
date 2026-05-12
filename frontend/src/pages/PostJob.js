import React, { useState, useContext } from "react";
import { ethers } from 'ethers';
import { getContract } from "../utils/contract";
import { WalletContext } from "../context/WalletContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const PostJob = () => {
    const { currentAccount } = useContext(WalletContext);
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [deadline, setDeadline] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [method, setMethod] = useState(user ? "email" : "metamask");

    // Post job via Email/Backend API
    const postJobViaEmail = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert("Please log in with email first!");
            return;
        }

        if (!title || !description || !budget || !deadline) {
            alert("Please fill in all fields!");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/jobs`,
                {
                    title,
                    description,
                    budget: parseFloat(budget),
                    deadline,
                    postedBy: user._id
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Job posted successfully via email!");
            setTitle("");
            setDescription("");
            setBudget("");
            setDeadline("");
        } catch (error) {
            console.error("Error posting job:", error);
            alert(error.response?.data?.message || "Error posting job!");
        } finally {
            setLoading(false);
        }
    };

    // Post job via MetaMask/Blockchain
    const createJobViaMetaMask = async (e) => {
        e.preventDefault();
        
        if (!currentAccount) {
            alert("Please connect your wallet first!");
            return;
        }

        if (!description || !amount) {
            alert("Please fill in job description and amount!");
            return;
        }

        try {
            setLoading(true);
            const contract = await getContract();
            const tx = await contract.postJob(description, { 
                value: ethers.parseEther(amount) 
            });
            await tx.wait();
            alert("Job posted successfully via MetaMask!");
            setDescription("");
            setAmount("");
        } catch (error) {
            console.error("Error posting job:", error);
            alert(error.message || "Error posting job!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Post a New Job</h2>
            
            {/* Method Selection */}
            {user && currentAccount && (
                <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                    <p><strong>Choose posting method:</strong></p>
                    <label>
                        <input
                            type="radio"
                            value="email"
                            checked={method === "email"}
                            onChange={(e) => setMethod(e.target.value)}
                        />
                        📧 Post via Email (Backend)
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            value="metamask"
                            checked={method === "metamask"}
                            onChange={(e) => setMethod(e.target.value)}
                        />
                        🦊 Post via MetaMask (Blockchain)
                    </label>
                </div>
            )}

            {/* Email Method */}
            {method === "email" && (
                <>
                    {!user && (
                        <p style={{ color: 'red' }}>Please log in with email to post a job via this method.</p>
                    )}
                    {user && (
                        <form onSubmit={postJobViaEmail}>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Job Title:</label><br />
                                <input
                                    type="text"
                                    placeholder="e.g., Build a website"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                    disabled={loading}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Job Description:</label><br />
                                <textarea
                                    placeholder="Describe the job in detail..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{ width: '100%', minHeight: '100px', padding: '8px', boxSizing: 'border-box' }}
                                    disabled={loading}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Budget ($):</label><br />
                                <input
                                    type="number"
                                    placeholder="500"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                    disabled={loading}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Deadline:</label><br />
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                    disabled={loading}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading || !user}
                                style={{ 
                                    padding: '10px 20px', 
                                    cursor: loading || !user ? 'not-allowed' : 'pointer',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px'
                                }}
                            >
                                {loading ? 'Posting...' : 'Post Job via Email'}
                            </button>
                        </form>
                    )}
                </>
            )}

            {/* MetaMask Method */}
            {method === "metamask" && (
                <>
                    {!currentAccount && (
                        <p style={{ color: 'red' }}>Please connect your wallet to post a job via blockchain.</p>
                    )}
                    {currentAccount && (
                        <form onSubmit={createJobViaMetaMask}>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Job Description:</label><br />
                                <textarea
                                    placeholder="Describe the job..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{ width: '100%', minHeight: '100px', padding: '8px', boxSizing: 'border-box' }}
                                    disabled={loading}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Payment Amount (ETH):</label><br />
                                <input
                                    type="text"
                                    placeholder="0.1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                    disabled={loading}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading || !currentAccount}
                                style={{ 
                                    padding: '10px 20px', 
                                    cursor: loading || !currentAccount ? 'not-allowed' : 'pointer',
                                    backgroundColor: '#FF6B35',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px'
                                }}
                            >
                                {loading ? 'Posting...' : 'Post Job via MetaMask'}
                            </button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
};

export default PostJob;

