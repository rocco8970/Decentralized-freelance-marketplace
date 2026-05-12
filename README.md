# FreelanceChain — Decentralized Freelance Marketplace

A full-stack Web3 freelance platform built with React, Node.js, MongoDB, and Ethereum smart contracts.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router, Ethers.js v6, Framer Motion |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Blockchain | Solidity 0.8.28, Hardhat, Ethereum (Sepolia testnet) |
| Auth | JWT (email) + MetaMask wallet signature |

## Features

- **Dual Authentication** — Login with email/password OR MetaMask wallet
- **Job Posting** — Post jobs via email (USD budget) or blockchain (ETH escrow)
- **Smart Contract Escrow** — ETH locked until job completion, trustless payment
- **Real-time Messaging** — Chat between clients and freelancers after job acceptance
- **Review System** — Star ratings and comments after job completion
- **Dashboard** — Track all jobs, roles, and statuses in one place
- **Animated UI** — Dark theme with glassmorphism, particle effects, and smooth transitions

## Project Structure

```
├── frontend/          React app (UI)
├── backend/           Express API + MongoDB
└── contracts/         Solidity smart contracts (Hardhat)
```

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # fill in REACT_APP_API_URL and contract address
npm start
```

### Smart Contracts
```bash
cd contracts
npm install
npx hardhat node          # local blockchain
npx hardhat run scripts/deploy.js --network localhost
```

## Smart Contract

The `FreelanceMarketplace.sol` contract handles:
- `postJob(description)` — locks ETH in escrow
- `acceptJob(jobId)` — freelancer claims the job
- `completeJob(jobId)` — client releases payment to freelancer

Deployed on Sepolia testnet. See `contracts/.env` for address.
