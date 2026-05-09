# Smart Contracts - Solidity

Ethereum smart contracts for the Decentralized Freelance Marketplace.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Start local blockchain
npx hardhat node

# Deploy contract (in another terminal)
npx hardhat run scripts/deploy.js --network localhost
```

## 📖 Documentation

For complete smart contract documentation, see:
- **[Smart Contract Guide](../docs/05-SMART-CONTRACT-GUIDE.md)** - Complete contract documentation
- **[Setup Guide](../docs/02-SETUP-GUIDE.md)** - Setup instructions
- **[Deployment Guide](../docs/06-DEPLOYMENT-GUIDE.md)** - Deployment instructions
- **[Troubleshooting](../docs/08-TROUBLESHOOTING.md)** - Common issues

## 🔧 Configuration

For testnet/mainnet deployment, create `.env` file:
```env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 🛠️ Available Scripts

- `npm run compile` - Compile contracts
- `npm run test` - Run tests
- `npm run deploy:local` - Deploy to local network
- `npm run deploy:sepolia` - Deploy to Sepolia testnet
- `npm run node` - Start Hardhat node
- `npm run clean` - Clean artifacts

## 📁 Project Structure

```
contracts/
├── contracts/          # Solidity contracts
│   └── FreelanceMarketplace.sol
├── scripts/            # Deployment scripts
│   └── deploy.js
├── test/               # Contract tests
└── hardhat.config.js   # Hardhat configuration
```

## 📝 Contract Functions

### Write Functions
- `postJob(description)` - Create new job (payable)
- `acceptJob(jobId)` - Accept a job
- `completeJob(jobId)` - Complete job and release payment

### Read Functions
- `jobs(jobId)` - Get job details
- `jobCount()` - Get total number of jobs
- `getAllJobs()` - Get all jobs array

See [Smart Contract Guide](../docs/05-SMART-CONTRACT-GUIDE.md) for complete documentation.

## 🌐 Networks

### Local (Hardhat)
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Sepolia Testnet
```bash
npx hardhat run scripts/deploy.js --network sepolia
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### Ethereum Mainnet
```bash
npx hardhat run scripts/deploy.js --network mainnet
npx hardhat verify --network mainnet CONTRACT_ADDRESS
```

## 🔗 Links

- Main Documentation: [../docs/](../docs/)
- Frontend: [../frontend/](../frontend/)
- Backend: [../backend/](../backend/)
