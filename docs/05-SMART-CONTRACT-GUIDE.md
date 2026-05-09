# Smart Contract Guide - FreelanceMarketplace.sol

## 📁 Project Structure

```
contracts/
├── contracts/
│   ├── FreelanceMarketplace.sol  # Main contract
│   └── Lock.sol                  # Sample contract
├── scripts/
│   └── deploy.js                 # Deployment script
├── test/
│   └── Lock.js                   # Sample tests
├── hardhat.config.js             # Hardhat configuration
├── package.json
└── .env                          # Environment variables
```

## 🔧 Technology Stack

- **Solidity 0.8.28** - Smart contract language
- **Hardhat 2.24.0** - Development environment
- **Ethers.js** - Contract deployment and interaction
- **OpenZeppelin** - Security libraries (optional)

## 📜 Contract Overview

### FreelanceMarketplace.sol

A decentralized freelance marketplace smart contract that handles job posting, acceptance, and payment escrow.

**Key Features:**
- ✅ Post jobs with ETH payment escrow
- ✅ Accept jobs as freelancer
- ✅ Complete jobs and release payment
- ✅ Transparent transaction history
- ✅ Secure payment handling

## 🔍 Contract Structure

### State Variables

```solidity
uint256 public jobCount = 0;  // Total number of jobs
```

### Enums

```solidity
enum JobStatus { Open, Accepted, Completed }
```

### Structs

```solidity
struct Job {
    uint256 id;                    // Job ID
    address payable client;        // Client wallet address
    address payable freelancer;    // Freelancer wallet address
    string description;            // Job description
    uint256 payment;               // Payment amount in Wei
    bool completed;                // Completion status
}
```

### Mappings

```solidity
mapping(uint256 => Job) public jobs;  // Job ID to Job struct
```

### Events

```solidity
event JobPosted(uint256 indexed jobId, address indexed client, string description, uint256 payment);
event JobAccepted(uint256 indexed jobId, address indexed freelancer);
event JobCompleted(uint256 indexed jobId, address indexed freelancer, uint256 payment);
```

## 📝 Contract Functions

### Write Functions (Transactions)

#### postJob(string memory _description) payable
Creates a new job with ETH payment locked in contract

**Parameters:**
- `_description`: Job description

**Requirements:**
- `msg.value > 0`: Payment must be greater than 0
- `_description` not empty

**Effects:**
- Creates new job
- Locks ETH in contract
- Increments jobCount
- Emits JobPosted event

**Usage:**
```javascript
const tx = await contract.postJob("Build a website", {
  value: ethers.parseEther("0.5")
});
await tx.wait();
```

#### acceptJob(uint256 _jobId)
Accepts an available job

**Parameters:**
- `_jobId`: ID of the job to accept

**Requirements:**
- Job must exist
- Job not already accepted
- Job not completed
- Caller is not the client

**Effects:**
- Assigns freelancer to job
- Emits JobAccepted event

**Usage:**
```javascript
const tx = await contract.acceptJob(0);
await tx.wait();
```

#### completeJob(uint256 _jobId)
Marks job as complete and releases payment to freelancer

**Parameters:**
- `_jobId`: ID of the job to complete

**Requirements:**
- Job must exist
- Caller must be the client
- Freelancer must be assigned
- Job not already completed

**Effects:**
- Marks job as completed
- Transfers payment to freelancer
- Emits JobCompleted event

**Usage:**
```javascript
const tx = await contract.completeJob(0);
await tx.wait();
```

### Read Functions (View)

#### jobs(uint256 _jobId) public view returns (Job)
Gets job details by ID

**Parameters:**
- `_jobId`: Job ID

**Returns:**
- Job struct

**Usage:**
```javascript
const job = await contract.jobs(0);
console.log(job.description);
```

#### jobCount() public view returns (uint256)
Gets total number of jobs

**Returns:**
- Total job count

**Usage:**
```javascript
const count = await contract.jobCount();
```

#### getJob(uint256 _jobId) public view returns (...)
Gets complete job information

**Parameters:**
- `_jobId`: Job ID

**Returns:**
- id, client, freelancer, description, payment, completed

**Usage:**
```javascript
const [id, client, freelancer, description, payment, completed] = 
  await contract.getJob(0);
```

#### getAllJobs() public view returns (Job[] memory)
Gets all jobs as an array

**Returns:**
- Array of all jobs

**Usage:**
```javascript
const allJobs = await contract.getAllJobs();
```

## 🔐 Security Features

### Access Control
- Only client can complete jobs
- Only freelancer receives payment
- Clients cannot accept their own jobs

### Validation
- Payment must be greater than 0
- Description cannot be empty
- Job must exist before operations
- Job cannot be accepted twice
- Job cannot be completed twice

### Payment Security
- ETH locked in contract until completion
- Payment only released to assigned freelancer
- No way to withdraw without completion

## 🚀 Deployment

### Local Network (Hardhat)

```bash
# Terminal 1: Start Hardhat node
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy.js --network localhost
```

### Sepolia Testnet

1. **Get Sepolia ETH** from faucet
2. **Configure .env:**
```env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

3. **Deploy:**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4. **Verify on Etherscan:**
```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### Ethereum Mainnet

⚠️ **WARNING**: This costs real money!

1. **Configure .env:**
```env
PRIVATE_KEY=your_private_key
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
```

2. **Deploy:**
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

## 🧪 Testing

### Run Tests
```bash
npx hardhat test
```

### Test Coverage
```bash
npx hardhat coverage
```

### Gas Reporter
```bash
REPORT_GAS=true npx hardhat test
```

## 📊 Gas Costs (Estimated)

| Function | Gas Cost |
|----------|----------|
| postJob | ~100,000 |
| acceptJob | ~50,000 |
| completeJob | ~60,000 |
| getJob | Free (view) |
| getAllJobs | Free (view) |

## 🔄 Workflow Example

### Complete Job Lifecycle

```javascript
// 1. Client posts job
const tx1 = await contract.postJob("Build a website", {
  value: ethers.parseEther("0.5")
});
await tx1.wait();
// Job ID: 0, Payment: 0.5 ETH locked in contract

// 2. Freelancer accepts job
const tx2 = await contract.acceptJob(0);
await tx2.wait();
// Freelancer assigned to job

// 3. Work is completed...

// 4. Client marks job complete
const tx3 = await contract.completeJob(0);
await tx3.wait();
// 0.5 ETH transferred to freelancer
```

## 🐛 Common Issues

**Insufficient Funds**
```
Error: insufficient funds for intrinsic transaction cost
```
**Solution**: Ensure wallet has enough ETH for gas + payment

**Job Already Accepted**
```
Error: Job already accepted
```
**Solution**: Job can only be accepted once

**Only Client Can Complete**
```
Error: Only client can complete the job
```
**Solution**: Only the job creator can mark it complete

## 📈 Future Enhancements

### Planned Features
1. **Dispute Resolution** - Arbitration mechanism
2. **Partial Payments** - Milestone-based payments
3. **Refunds** - Cancel job and refund client
4. **Deadlines** - Time-based job completion
5. **Ratings** - On-chain reputation system
6. **Categories** - Job categorization
7. **Escrow Extension** - Extend job deadline

### Security Improvements
1. **Reentrancy Guard** - Prevent reentrancy attacks
2. **Pausable** - Emergency stop mechanism
3. **Upgradeable** - Proxy pattern for upgrades
4. **Multi-sig** - Multi-signature for admin functions

## 📚 Additional Resources

- Solidity Documentation: https://docs.soliditylang.org
- Hardhat Documentation: https://hardhat.org/docs
- Ethers.js Documentation: https://docs.ethers.org
- OpenZeppelin Contracts: https://docs.openzeppelin.com/contracts
- Ethereum Development: https://ethereum.org/developers

## 🔍 Contract Verification

After deployment, verify your contract on Etherscan:

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

This allows users to:
- Read contract source code
- Interact with contract on Etherscan
- Verify contract authenticity
- Build trust with users

## 💡 Best Practices

1. **Always test on testnet first**
2. **Verify contracts on Etherscan**
3. **Use events for important state changes**
4. **Implement proper access control**
5. **Validate all inputs**
6. **Handle edge cases**
7. **Document your code**
8. **Consider gas optimization**
9. **Audit before mainnet deployment**
10. **Monitor contract activity**
