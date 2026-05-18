# FreelanceChain — Decentralized Freelance Marketplace

A full-stack Web3 freelance platform built with React, Node.js, MongoDB, and Ethereum smart contracts.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, Ethers.js v6, Framer Motion, Axios |
| Backend | Node.js, Express 5, MongoDB, Mongoose, JWT, bcryptjs |
| Blockchain | Solidity 0.8.28, Hardhat 2.24, Ethereum (local / Sepolia testnet) |
| Auth | JWT (email/password) + MetaMask wallet signature |

## Features

- **Dual Authentication** — Register/login with email+password OR connect MetaMask wallet
- **Smart Contract Escrow** — ETH locked in contract until job completion, trustless payment release
- **Job Posting** — Post jobs on-chain with ETH payment locked as escrow
- **Job Browsing** — Freelancers browse and accept open jobs from the blockchain
- **Dashboard** — Track all posted and accepted jobs with real-time status
- **Messaging** — Chat between clients and freelancers (stored in MongoDB)
- **Review System** — Leave ratings and comments after job completion
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
- `getJob(jobId)` / `getAllJobs()` — read job data

Current local contract address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

## Backend API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register with email/password |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/wallet-auth` | Login/register via wallet |
| GET | `/api/users/profile` | Get profile (protected) |
| POST | `/api/jobs` | Create job (DB) |
| GET | `/api/jobs` | List all jobs (DB) |
| POST | `/api/messages/send` | Send message (protected) |
| GET | `/api/messages/:u1/:u2` | Get conversation (protected) |
| POST | `/api/reviews` | Post review (protected) |
| GET | `/api/reviews/user/:userId` | Get user reviews |
| GET | `/api/health` | API health check |

## Documentation

Full docs are in the [`docs/`](docs/) folder:

| File | Contents |
|------|----------|
| [01-PROJECT-OVERVIEW.md](docs/01-PROJECT-OVERVIEW.md) | Architecture, features, data models |
| [02-SETUP-GUIDE.md](docs/02-SETUP-GUIDE.md) | Step-by-step local setup |
| [03-FRONTEND-GUIDE.md](docs/03-FRONTEND-GUIDE.md) | React app structure and components |
| [04-BACKEND-GUIDE.md](docs/04-BACKEND-GUIDE.md) | Express API, models, middleware |
| [05-SMART-CONTRACT-GUIDE.md](docs/05-SMART-CONTRACT-GUIDE.md) | Solidity contract reference |
| [06-DEPLOYMENT-GUIDE.md](docs/06-DEPLOYMENT-GUIDE.md) | Vercel / Railway / Atlas deployment |
| [07-API-REFERENCE.md](docs/07-API-REFERENCE.md) | Complete API reference with examples |
| [08-TROUBLESHOOTING.md](docs/08-TROUBLESHOOTING.md) | Common errors and fixes |
