# 🚀 Deployment Checklist - Decentralized Freelance Marketplace

## ✅ PROJECT STATUS OVERVIEW

| Component | Status | Notes |
|-----------|--------|-------|
| Backend | ✅ Ready | Express.js, MongoDB configured |
| Frontend | ✅ Ready | React, Web3.js integration ready |
| Smart Contract | ✅ Ready | Hardhat configured, Solidity ready |
| Documentation | ✅ Complete | Guides available |
| Environment Files | ⚠️ MISSING | Need to create .env files |
| Dependencies | ✅ Configured | All in package.json |

---

## 📋 PHASE 1: LOCAL DEVELOPMENT SETUP (MUST DO FIRST)

### 1.1 Environment Variables - CRITICAL ⚠️

**Backend: Create `backend/.env`**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/freelance-marketplace
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**Frontend: Create `frontend/.env`**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=0x5fbdb2315678afecb367f032d93f642f64180aa3
REACT_APP_NETWORK_URL=http://localhost:8545
```

**Smart Contracts: Create `contracts/.env`**
```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
REPORT_GAS=false
```

### 1.2 Prerequisites Installation
- [ ] Node.js v16+ installed (`node --version`)
- [ ] MongoDB installed locally OR MongoDB Atlas account created
- [ ] MetaMask extension installed in browser
- [ ] Git installed (optional)

### 1.3 Install All Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# Smart Contracts
cd contracts && npm install
```

---

## 🔧 PHASE 2: LOCAL TESTING (Before Production)

### 2.1 Test Local Blockchain
```bash
# Terminal 1: Start Hardhat node
cd contracts
npx hardhat node
```
✅ Verify: You should see 20 test accounts with 10,000 ETH each

### 2.2 Test Smart Contract Deployment
```bash
# Terminal 2: Deploy to local network
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```
✅ Verify: Contract deployed to 0x5FbDB2315678... (saved automatically)

### 2.3 Test Backend
```bash
# Terminal 3: Start backend
cd backend
npm run dev
```
✅ Verify: Server running on port 5000, MongoDB connected

### 2.4 Test Frontend
```bash
# Terminal 4: Start frontend
cd frontend
npm start
```
✅ Verify: React app opens at http://localhost:3000

### 2.5 Test Integration
- [ ] Connect MetaMask to localhost:8545
- [ ] Create user account
- [ ] Post a job
- [ ] Browse jobs
- [ ] Send messages
- [ ] View dashboard

---

## 🌐 PHASE 3: TESTNET DEPLOYMENT (Sepolia)

### 3.1 Get Sepolia Testnet Requirements

**Step 1: Get Sepolia ETH (Free)**
- [ ] Go to https://sepoliafaucet.com
- [ ] Enter your wallet address
- [ ] Get 0.5 testnet ETH

**Step 2: Get Infura API Key**
- [ ] Go to https://infura.io
- [ ] Sign up for free account
- [ ] Create new project: "Freelance Marketplace"
- [ ] Copy Project ID
- [ ] Use URL: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

**Step 3: Get Etherscan API Key (Optional, for verification)**
- [ ] Go to https://etherscan.io
- [ ] Sign up and create account
- [ ] Go to API keys section
- [ ] Create new API key

### 3.2 Update Contracts/.env for Testnet
```env
PRIVATE_KEY=your_wallet_private_key (keep secure!)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
REPORT_GAS=true
```

### 3.3 Deploy to Sepolia
```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```
✅ Save the contract address returned!

### 3.4 Verify Contract on Sepolia (Optional)
```bash
cd contracts
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

### 3.5 Update Frontend for Testnet
Update `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=YOUR_SEPOLIA_CONTRACT_ADDRESS
REACT_APP_NETWORK_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

### 3.6 Connect MetaMask to Sepolia
- [ ] Open MetaMask
- [ ] Click network selector
- [ ] Select "Sepolia" or add custom network
- [ ] Switch wallet address to one with Sepolia ETH

### 3.7 Test on Testnet
- [ ] Load frontend (npm start)
- [ ] Connect MetaMask to Sepolia
- [ ] Post a job (pays gas fees in Sepolia ETH)
- [ ] Accept job
- [ ] Verify contract interactions work

---

## 🎯 PHASE 4: PRODUCTION DEPLOYMENT

### 4.1 Database Deployment (MongoDB Atlas)

**Step 1: Create MongoDB Atlas Account**
- [ ] Go to https://mongodb.com/cloud/atlas
- [ ] Create free account
- [ ] Create organization: "Freelance Marketplace"

**Step 2: Create Cluster**
- [ ] Click "Build a Database"
- [ ] Choose FREE tier (M0)
- [ ] Select region closest to you
- [ ] Name: "freelance-prod-cluster"
- [ ] Create cluster (takes 1-3 min)

**Step 3: Configure Database Access**
- [ ] Go to "Database Access"
- [ ] Add new database user
- [ ] Username: `freelance_prod_admin`
- [ ] Generate strong password (save it!)
- [ ] Set "Read and write to any database"

**Step 4: Configure Network Access**
- [ ] Go to "Network Access"
- [ ] Add IP Address: 0.0.0.0/0 (allows any IP)
- [ ] Add: Your deployment server IP (Railway/Render/etc)

**Step 5: Get Connection String**
- [ ] Click "Connect"
- [ ] Copy connection string
- [ ] Format: `mongodb+srv://freelance_prod_admin:PASSWORD@cluster.mongodb.net/freelance-marketplace?retryWrites=true&w=majority`

### 4.2 Backend Deployment (Railway or Render)

**Using Railway:**

1. [ ] Sign up at https://railway.app
2. [ ] Connect GitHub account
3. [ ] Create new project from GitHub repo
4. [ ] Add MongoDB plugin
5. [ ] Set environment variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://freelance_prod_admin:PASSWORD@cluster.mongodb.net/freelance-marketplace
   JWT_SECRET=your_strong_production_secret_key_12345
   NODE_ENV=production
   ```
6. [ ] Deploy (automatic on push to main)
7. [ ] Note backend URL: `https://your-backend.railway.app`

**Using Render:**

1. [ ] Sign up at https://render.com
2. [ ] Connect GitHub
3. [ ] Create new Web Service
4. [ ] Set start command: `npm run start`
5. [ ] Add environment variables (same as above)
6. [ ] Deploy

### 4.3 Smart Contract Deployment (Ethereum Mainnet)

⚠️ **WARNING: Real money involved! Double-check everything!**

**Step 1: Prepare Wallet**
- [ ] Have wallet with ETH for gas fees (~$50-200 depending on network)
- [ ] Export private key (NEVER share!)
- [ ] Store safely

**Step 2: Get Mainnet Infura Key**
- [ ] Go to https://infura.io
- [ ] Create mainnet endpoint
- [ ] Copy endpoint URL

**Step 3: Update contracts/.env**
```env
PRIVATE_KEY=your_mainnet_wallet_private_key
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
ETHERSCAN_API_KEY=your_etherscan_key
REPORT_GAS=false
```

**Step 4: Deploy to Mainnet**
```bash
cd contracts
npx hardhat run scripts/deploy.js --network mainnet
```

**Step 5: Verify Contract**
```bash
npx hardhat verify --network mainnet YOUR_CONTRACT_ADDRESS
```

### 4.4 Frontend Deployment (Vercel)

**Step 1: Prepare Frontend**
```env
REACT_APP_API_URL=https://your-backend.railway.app/api
REACT_APP_CONTRACT_ADDRESS=YOUR_MAINNET_CONTRACT_ADDRESS
REACT_APP_NETWORK_URL=https://mainnet.infura.io/v3/YOUR_KEY
```

**Step 2: Deploy to Vercel**
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub
- [ ] Import project
- [ ] Select `frontend` directory
- [ ] Add environment variables
- [ ] Deploy

**Step 3: Connect Custom Domain (Optional)**
- [ ] Buy domain (Namecheap, GoDaddy, etc.)
- [ ] In Vercel: Add custom domain
- [ ] Update DNS settings
- [ ] Enable SSL

### 4.5 Production Checklist
- [ ] Backend deployed and running
- [ ] Frontend deployed to Vercel
- [ ] MongoDB Atlas cluster active
- [ ] Smart contract verified on mainnet
- [ ] All environment variables set
- [ ] HTTPS enabled everywhere
- [ ] MetaMask can connect to mainnet

---

## 🔒 PHASE 5: SECURITY & MONITORING

### 5.1 Security Checklist
- [ ] All private keys stored in `.env` (not committed to git)
- [ ] `.gitignore` includes `.env`
- [ ] JWT_SECRET is strong and random (20+ chars)
- [ ] Database user has minimal required permissions
- [ ] CORS configured for production domain only
- [ ] Rate limiting implemented on API
- [ ] Input validation on all endpoints

### 5.2 Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Enable backend logs on Railway/Render
- [ ] Monitor database with MongoDB Atlas
- [ ] Set up alerts for high gas prices (for mainnet)

### 5.3 Backup Strategy
- [ ] Export MongoDB database weekly
- [ ] Backup smart contract code to GitHub
- [ ] Store private key backups securely

---

## 📊 DEPLOYMENT SUMMARY TABLE

| Stage | Status | Timeline | Cost |
|-------|--------|----------|------|
| **Local Dev** | Ready | 30 min | Free |
| **Local Testing** | Ready | 1 hour | Free |
| **Testnet (Sepolia)** | Ready | 1 hour | Free (+ gas for testing) |
| **Production DB** | Ready | 15 min | Free tier or $15-57/mo |
| **Production Backend** | Ready | 15 min | $5-7/mo (Railway hobby) |
| **Production Frontend** | Ready | 10 min | Free (Vercel) |
| **Mainnet Contract** | Ready | 30 min | $50-200 (gas fees) |

---

## 🆘 TROUBLESHOOTING

### Issue: "Cannot find module 'dotenv'"
**Solution:** Run `npm install` in the respective folder

### Issue: MongoDB connection refused
**Solution:** 
- Check MongoDB is running: `mongod`
- Or use MongoDB Atlas cloud version
- Verify MONGO_URI in .env

### Issue: Contract deployment fails
**Solution:**
- Check you have ETH for gas fees
- Verify RPC URL is correct
- Check private key format (no 0x prefix in .env)

### Issue: Frontend can't connect to backend
**Solution:**
- Verify backend is running
- Check REACT_APP_API_URL in .env
- Verify CORS is enabled in backend

### Issue: MetaMask connection fails
**Solution:**
- Make sure MetaMask is on correct network
- Verify REACT_APP_NETWORK_URL matches MetaMask network
- Check RPC URL is accessible

---

## ✨ NEXT STEPS

1. **Create .env files** (see Phase 1.1)
2. **Test locally** (Phase 2)
3. **Get testnet ETH** (Phase 3.1)
4. **Deploy to Sepolia** (Phase 3.3)
5. **Set up MongoDB Atlas** (Phase 4.1)
6. **Deploy backend** (Phase 4.2)
7. **Deploy frontend** (Phase 4.4)
8. **Deploy to mainnet** (Phase 4.3)

---

**Created:** May 9, 2026
**Last Updated:** May 9, 2026
**Status:** ✅ All components ready for deployment
