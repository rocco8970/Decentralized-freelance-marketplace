import React, { useState, useContext } from "react";
import { ethers } from 'ethers';
import { getContract } from "../utils/contract";
import { WalletContext } from "../context/WalletContext";

const PostJob = () => {
    const { currentAccount } = useContext(WalletContext);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const createJob = async (e) => {
        e.preventDefault();
        
        if (!currentAccount) {
            alert("Please connect your wallet first!");
            return;
        }

        if (!description || !amount) {
            alert("Please fill in all fields!");
            return;
        }

        try {
            setLoading(true);
            const contract = await getContract();
            const tx = await contract.postJob(description, { 
                value: ethers.parseEther(amount) 
            });
            await tx.wait();
            alert("Job posted successfully!");
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
            {!currentAccount && (
                <p style={{ color: 'red' }}>Please connect your wallet to post a job.</p>
            )}
            <form onSubmit={createJob}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Job Description:</label><br />
                    <textarea
                        placeholder="Describe the job..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: '100%', minHeight: '100px', padding: '8px' }}
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
                        style={{ width: '100%', padding: '8px' }}
                        disabled={loading}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading || !currentAccount}
                    style={{ padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Posting...' : 'Post Job'}
                </button>
            </form>
        </div>
    );
};

export default PostJob;

