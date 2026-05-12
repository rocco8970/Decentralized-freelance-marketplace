# ⚡ QUICK COMMAND REFERENCE - Deployment

## 🎯 STEP 1: CREATE ENVIRONMENT FILES (DO THIS FIRST!)

### Create Backend .env
```bash
cd backend
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb://localhost:27017/freelance-marketplace
JWT_SECRET=change_this_to_a_strong_secret_key_12345
EOF
```

### Create Frontend .env
```bash
cd frontend
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=0x5fbdb2315678afecb367f032d93f642f64180aa3
REACT_APP_NETWORK_URL=http://localhost:8545
EOF
```

### Create Contracts .env
```bash
cd contracts
cat > .env << EOF
PRIVATE_KEY=your_wallet_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
REPORT_GAS=false
EOF
```

---

## 📦 STEP 2: INSTALL ALL DEPENDENCIES

```bash
# Terminal 1
cd backend && npm install

# Terminal 2
cd ../frontend && npm install

# Terminal 3
cd ../contracts && npm install
```

---

## 🚀 STEP 3: RUN LOCAL DEVELOPMENT

### Terminal 1: Start Blockchain
```bash
cd contracts
npx hardhat node
```
✅ **Keep this running!** You should see 20 accounts with 10000 ETH each

### Terminal 2: Deploy Smart Contract
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```
✅ Wait for: "Contract address and ABI saved to frontend!"

### Terminal 3: Start Backend
```bash
cd backend
npm run dev
```
✅ Wait for: "MongoDB Connected" and "Server running on port 5000"

### Terminal 4: Start Frontend
```bash
cd frontend
npm start
```
✅ Browser opens at http://localhost:3000

---

## 🧪 STEP 4: TEST LOCAL SETUP

1. Open http://localhost:3000
2. Click Connect Wallet
3. MetaMask should connect to localhost:8545
4. Register a new account
5. Post a job
6. Browse jobs
7. Send messages

---

## 🌐 STEP 5: DEPLOY TO SEPOLIA TESTNET

### Get Sepolia ETH (Free)
```
Go to: https://sepoliafaucet.com
Paste your wallet address
Claim 0.5 Sepolia ETH
```

### Get Infura API Key
```
1. Go to https://infura.io
2. Create project "Freelance Marketplace"
3. Copy Project ID
4. Use: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

### Update contracts/.env
```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
REPORT_GAS=false
```

### Deploy to Sepolia
```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

### Update frontend/.env
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=YOUR_SEPOLIA_CONTRACT_ADDRESS
REACT_APP_NETWORK_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

### Test on Sepolia
1. Connect MetaMask to Sepolia network
2. Reload frontend
3. Test job posting (uses Sepolia ETH for gas)

---

## 🎯 STEP 6: PRODUCTION DEPLOYMENT

### 6.1 Database - MongoDB Atlas

```bash
# Instructions:
1. Go to https://mongodb.com/cloud/atlas
2. Create free account & project
3. Create FREE tier cluster
4. Add database user: freelance_prod_admin
5. Allow access from anywhere: 0.0.0.0/0
6. Get connection string:
   mongodb+srv://freelance_prod_admin:PASSWORD@cluster.mongodb.net/freelance-marketplace
```

### 6.2 Backend - Railway

```bash
# Instructions:
1. Go to https://railway.app
2. Sign up with GitHub
3. Connect your GitHub repo
4. Create project from GitHub
5. Add environment variables:
   - MONGO_URI=mongodb+srv://...
   - JWT_SECRET=your_strong_secret
   - NODE_ENV=production
   - PORT=5000
6. Railway auto-deploys on push to main
7. Copy backend URL from Railway dashboard
```

### 6.3 Frontend - Vercel

```bash
# Update frontend/.env:
REACT_APP_API_URL=https://your-railway-backend.app/api
REACT_APP_CONTRACT_ADDRESS=YOUR_MAINNET_CONTRACT_ADDRESS
REACT_APP_NETWORK_URL=https://mainnet.infura.io/v3/YOUR_KEY

# Instructions:
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository
4. Select frontend directory
5. Add environment variables
6. Click Deploy
```

### 6.4 Smart Contract - Ethereum Mainnet

```bash
# ⚠️ WARNING: Real ETH involved! (~$50-200 gas fees)

# 1. Update contracts/.env with mainnet config:
PRIVATE_KEY=your_mainnet_wallet_key
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY

# 2. Make sure wallet has ETH for gas
# 3. Deploy:
cd contracts
npx hardhat run scripts/deploy.js --network mainnet

# 4. Verify (optional):
npx hardhat verify --network mainnet YOUR_CONTRACT_ADDRESS
```

---

## 📊 VERIFICATION CHECKLIST

### Local Development
- [ ] Hardhat node running on localhost:8545
- [ ] Contract deployed to 0x5FbDB...
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MetaMask connected to localhost
- [ ] Can create account and post job

### Testnet (Sepolia)
- [ ] Have Sepolia ETH
- [ ] Infura API key set
- [ ] Contract deployed to Sepolia
- [ ] Frontend .env updated with Sepolia contract
- [ ] MetaMask on Sepolia network
- [ ] Job posting works with gas fees

### Production
- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Contract deployed to mainnet
- [ ] All environment variables set
- [ ] HTTPS working
- [ ] Email tests working

---

## 🆘 COMMON ISSUES

| Issue | Solution |
|-------|----------|
| `.env not found` | Create file manually in each folder |
| `Cannot connect to MongoDB` | Run `mongod` or use MongoDB Atlas |
| `Contract deployment fails` | Check you have ETH for gas |
| `Frontend can't reach backend` | Verify backend is running and CORS enabled |
| `MetaMask won't connect` | Check network URL in .env matches MetaMask network |

---

## 📞 SUPPORT

Check documentation:
- Local setup: `HOW-TO-START-PROJECT.md`
- Deployment: `DEPLOYMENT-CHECKLIST.md`
- Troubleshooting: `docs/08-TROUBLESHOOTING.md`
- Full guide: `docs/06-DEPLOYMENT-GUIDE.md`
