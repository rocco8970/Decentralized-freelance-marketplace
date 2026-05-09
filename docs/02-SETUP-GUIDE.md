# Complete Setup Guide - Decentralized Freelance Marketplace

This guide will walk you through setting up the entire project from scratch to a working application.

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- ✅ **MongoDB** - [Download](https://mongodb.com/try/download/community) or use [MongoDB Atlas](https://mongodb.com/cloud/atlas)
- ✅ **MetaMask** browser extension - [Install](https://metamask.io/download/)
- ✅ **Git** (optional) - [Download](https://git-scm.com/)
- ✅ **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Install dependencies for all projects
cd backend && npm install
cd ../frontend && npm install
cd ../contracts && npm install

# 2. Setup environment variables (see detailed steps below)

# 3. Start MongoDB (if local)
mongod

# 4. Start Hardhat node (Terminal 1)
cd contracts
npx hardhat node

# 5. Deploy contract (Terminal 2)
cd contracts
npx hardhat run scripts/deploy.js --network localhost

# 6. Start backend (Terminal 3)
cd backend
npm run dev

# 7. Start frontend (Terminal 4)
cd frontend
npm start
```

## 📝 Detailed Setup Instructions

### Step 1: Backend Setup

#### 1.1 Install Dependencies

```bash
cd backend
npm install
```

#### 1.2 Configure Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/freelance-marketplace
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/freelance-marketplace
```

#### 1.3 Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
1. Create account at [MongoDB Atlas](https://mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

#### 1.4 Test Backend

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

### Step 2: Smart Contract Setup

#### 2.1 Install Dependencies

```bash
cd contracts
npm install
```

#### 2.2 Compile Contracts

```bash
npx hardhat compile
```

You should see:
```
Compiled 1 Solidity file successfully
```

#### 2.3 Start Local Blockchain

Open a new terminal and run:

```bash
npx hardhat node
```

This will:
- Start a local Ethereum network
- Create 20 test accounts with 10,000 ETH each
- Display account addresses and private keys
- Keep running (don't close this terminal)

**Important**: Copy one of the account addresses and private keys for MetaMask setup.

#### 2.4 Deploy Contract

Open another terminal:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

You should see:
```
Deploying FreelanceMarketplace contract...
FreelanceMarketplace deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract address and ABI saved to frontend!
```

**Important**: Copy the contract address - you'll need it for the frontend.

### Step 3: Frontend Setup

#### 3.1 Install Dependencies

```bash
cd frontend
npm install
```

#### 3.2 Configure Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_NETWORK_URL=http://localhost:8545
```

**Replace** `REACT_APP_CONTRACT_ADDRESS` with the address from Step 2.4.

#### 3.3 Start Frontend

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Step 4: MetaMask Setup

#### 4.1 Install MetaMask

If not installed, get it from [metamask.io](https://metamask.io/download/)

#### 4.2 Add Local Network

1. Open MetaMask
2. Click network dropdown (top)
3. Click "Add Network"
4. Click "Add a network manually"
5. Enter details:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
6. Click "Save"

#### 4.3 Import Test Account

1. Click account icon (top right)
2. Click "Import Account"
3. Paste private key from Hardhat node (Step 2.3)
4. Click "Import"

You should now have 10,000 ETH in your account!

### Step 5: Test the Application

#### 5.1 Connect Wallet

1. Go to [http://localhost:3000](http://localhost:3000)
2. Click "Connect Wallet"
3. Approve in MetaMask
4. You should see your wallet address in the navbar

#### 5.2 Register User (Optional)

1. Click "Register"
2. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Register"
4. Go to "Login" and login

#### 5.3 Post a Job

1. Go to "Post Job"
2. Fill in:
   - Description: "Build a website"
   - Payment: 0.1 (ETH)
3. Click "Post Job"
4. Approve transaction in MetaMask
5. Wait for confirmation
6. You should see "Job posted successfully!"

#### 5.4 Browse Jobs

1. Go to "Browse Jobs"
2. You should see your posted job
3. Note the job details

#### 5.5 Accept Job (Different Account)

1. Import another account from Hardhat node
2. Switch to that account in MetaMask
3. Refresh the page
4. Go to "Browse Jobs"
5. Click "Accept Job" on your job
6. Approve transaction
7. Job should disappear from browse (now assigned)

#### 5.6 Complete Job

1. Switch back to first account (client)
2. Go to "Dashboard"
3. You should see your job with freelancer assigned
4. Click "Mark as Complete"
5. Approve transaction
6. Payment released to freelancer!

## 🔧 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB
```bash
mongod
```

**Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process on port 5000
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Smart Contract Issues

**Contract Not Found**
```
Error: cannot find module 'FreelanceMarketplace'
```
**Solution**: Compile contracts
```bash
npx hardhat compile
```

**Network Error**
```
Error: could not detect network
```
**Solution**: Ensure Hardhat node is running
```bash
npx hardhat node
```

### Frontend Issues

**MetaMask Not Detected**
```
Please install MetaMask!
```
**Solution**: Install MetaMask extension and refresh page

**Wrong Network**
```
Transaction failed
```
**Solution**: Switch to Hardhat Local network in MetaMask

**Contract Address Not Found**
```
Error: contract not deployed
```
**Solution**: 
1. Check `.env` has correct contract address
2. Redeploy contract
3. Restart frontend

## 📊 Verification Checklist

After setup, verify everything works:

- [ ] Backend running on port 5000
- [ ] MongoDB connected
- [ ] Hardhat node running
- [ ] Contract deployed
- [ ] Frontend running on port 3000
- [ ] MetaMask connected to local network
- [ ] Can connect wallet
- [ ] Can post job
- [ ] Can browse jobs
- [ ] Can accept job
- [ ] Can complete job
- [ ] Can send messages (if logged in)

## 🔄 Development Workflow

### Daily Development

1. **Start all services**:
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Hardhat
cd contracts && npx hardhat node

# Terminal 3: Backend
cd backend && npm run dev

# Terminal 4: Frontend
cd frontend && npm start
```

2. **Make changes**
3. **Test changes**
4. **Commit changes**

### After Contract Changes

```bash
# 1. Compile
npx hardhat compile

# 2. Redeploy
npx hardhat run scripts/deploy.js --network localhost

# 3. Restart frontend
cd frontend
npm start
```

## 🎯 Next Steps

After successful setup:

1. **Customize the application**
   - Change branding
   - Add features
   - Improve UI/UX

2. **Deploy to testnet**
   - Get Sepolia ETH from faucet
   - Deploy contract to Sepolia
   - Test with real blockchain

3. **Deploy to production**
   - See `06-DEPLOYMENT-GUIDE.md`
   - Deploy frontend to Vercel
   - Deploy backend to Railway
   - Deploy contract to mainnet

## 🎉 Success!

If you've completed all steps, you now have a fully functional decentralized freelance marketplace running locally!

**Ready for the next level?** Check out `06-DEPLOYMENT-GUIDE.md` to deploy your application to the internet!
