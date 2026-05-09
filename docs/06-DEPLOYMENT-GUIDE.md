# Deployment Guide - Production Deployment

This guide covers deploying your Decentralized Freelance Marketplace to production.

## 🎯 Deployment Strategy

```
Frontend (Vercel)  →  Backend (Railway)  →  MongoDB Atlas
       ↓
Smart Contract (Ethereum Sepolia/Mainnet)
```

## 📋 Pre-Deployment Checklist

- [ ] All code tested locally
- [ ] Environment variables documented
- [ ] Database backup created
- [ ] Smart contract audited (for mainnet)
- [ ] Domain name purchased (optional)
- [ ] SSL certificates ready (handled by platforms)

## 🗄️ Step 1: Deploy Database (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new project: "Freelance Marketplace"

### 1.2 Create Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select cloud provider and region
4. Name cluster: "freelance-cluster"
5. Click "Create"

### 1.3 Configure Database Access

1. Go to "Database Access"
2. Click "Add New Database User"
3. Username: `freelance-admin`
4. Password: Generate secure password (save it!)
5. Privileges: "Read and write to any database"
6. Click "Add User"

### 1.4 Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String

```
mongodb+srv://freelance-admin:PASSWORD@freelance-cluster.xxxxx.mongodb.net/freelance-marketplace?retryWrites=true&w=majority
```

**Save this connection string!**

## 🔗 Step 2: Deploy Smart Contract

### Option A: Sepolia Testnet (Recommended First)

#### 2.1 Get Sepolia ETH
- https://sepoliafaucet.com
- https://faucet.sepolia.dev

#### 2.2 Get Infura API Key
1. Go to [Infura](https://infura.io)
2. Create project: "Freelance Marketplace"
3. Copy Project ID

#### 2.3 Configure Environment

Edit `contracts/.env`:
```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### 2.4 Deploy to Sepolia

```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

**Save the contract address!**

#### 2.5 Verify Contract

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

### Option B: Ethereum Mainnet (Production)

⚠️ **WARNING**: This costs real money!

Same steps as Sepolia, but:
- Use mainnet RPC
- Need real ETH (~0.05-0.1 ETH)
- Deploy: `npx hardhat run scripts/deploy.js --network mainnet`

## 🖥️ Step 3: Deploy Backend (Railway)

### 3.1 Prepare Backend

Ensure `package.json` has:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 3.2 Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your repository
6. Choose `backend` folder
7. Click "Deploy"

### 3.3 Configure Environment Variables

Add in Railway dashboard:
```
PORT=5000
MONGO_URI=mongodb+srv://freelance-admin:PASSWORD@cluster.mongodb.net/freelance-marketplace
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 3.4 Get Backend URL

Generate domain in Railway:
```
https://your-app.up.railway.app
```

**Save this URL!**

### 3.5 Test Backend

```bash
curl https://your-app.up.railway.app/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

## 🌐 Step 4: Deploy Frontend (Vercel)

### 4.1 Prepare Frontend

Update `.env`:
```env
REACT_APP_API_URL=https://your-app.up.railway.app/api
REACT_APP_CONTRACT_ADDRESS=0xYourSepoliaContractAddress
REACT_APP_NETWORK_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

Test build:
```bash
cd frontend
npm run build
```

### 4.2 Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your repository
5. Select `frontend` folder
6. Framework: Create React App (auto-detected)
7. Click "Deploy"

### 4.3 Configure Environment Variables

Add in Vercel dashboard:
```
REACT_APP_API_URL=https://your-app.up.railway.app/api
REACT_APP_CONTRACT_ADDRESS=0xYourContractAddress
REACT_APP_NETWORK_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

Redeploy after adding variables.

### 4.4 Get Frontend URL

```
https://your-app.vercel.app
```

### 4.5 Configure Custom Domain (Optional)

1. Buy domain from Namecheap, GoDaddy, etc.
2. In Vercel: Settings > Domains
3. Add your domain
4. Update DNS records
5. Wait for DNS propagation

## 🔐 Step 5: Configure CORS

Update backend `server.js`:

```javascript
const corsOptions = {
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

Redeploy backend.

## 🧪 Step 6: Test Production Deployment

### Functionality Tests
- [ ] Homepage loads
- [ ] Wallet connection works
- [ ] Can navigate between pages
- [ ] Login/Register works
- [ ] Can post a job
- [ ] Can browse jobs
- [ ] Can accept a job
- [ ] Dashboard shows correct data
- [ ] Can complete a job
- [ ] Messages work

### MetaMask Integration
- [ ] MetaMask prompts appear
- [ ] Transactions can be signed
- [ ] Network switching works
- [ ] Account switching detected

## 📊 Step 7: Monitoring

### Set Up Monitoring

**Vercel**:
- Analytics built-in
- Check deployment logs
- Monitor performance

**Railway**:
- Check application logs
- Monitor resource usage
- Set up alerts

**MongoDB Atlas**:
- Monitor database performance
- Set up backup schedule
- Check connection metrics

### Regular Maintenance

**Weekly**:
- Check error logs
- Monitor gas prices
- Review user feedback

**Monthly**:
- Update dependencies
- Security audit
- Performance optimization
- Database backup

## 💰 Cost Breakdown

### Free Tier (Testing)
- Vercel: Free
- Railway: $5/month credit
- MongoDB Atlas: Free (512MB)
- Sepolia: Free (test ETH)
- **Total**: $0-5/month

### Production (Low Traffic)
- Vercel: $20/month
- Railway: $10-20/month
- MongoDB Atlas: $9/month
- Ethereum Mainnet: Gas fees
- **Total**: $39-49/month + gas

### Production (High Traffic)
- Vercel: $20-100/month
- Railway: $50-100/month
- MongoDB Atlas: $57/month
- Ethereum Mainnet: Gas fees
- **Total**: $127-257/month + gas

## 🚨 Security Checklist

- [ ] Environment variables not in code
- [ ] Private keys never committed
- [ ] CORS properly configured
- [ ] JWT secret is strong
- [ ] MongoDB access restricted
- [ ] HTTPS enabled
- [ ] Smart contract audited
- [ ] Rate limiting enabled
- [ ] Input validation on backend
- [ ] XSS protection enabled

## 🐛 Troubleshooting Production

### Frontend Issues

**Build Fails**
```
Error: Module not found
```
**Solution**: Check imports, run `npm install`

**Environment Variables Not Working**
**Solution**: 
- Must start with `REACT_APP_`
- Redeploy after adding
- Check Vercel dashboard

### Backend Issues

**Database Connection Error**
```
MongoNetworkError
```
**Solution**: 
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check MongoDB Atlas status

**CORS Error**
```
Access-Control-Allow-Origin
```
**Solution**: Add frontend URL to CORS whitelist

### Smart Contract Issues

**Transaction Fails**
```
Insufficient funds
```
**Solution**: Ensure wallet has ETH on correct network

**Wrong Network**
**Solution**: Switch MetaMask to Sepolia/Mainnet

## 🔄 Continuous Deployment

### Auto-Deploy Setup

**Vercel** (Frontend):
- Automatically deploys on git push
- Preview deployments for PRs
- Production deployment on main branch

**Railway** (Backend):
- Automatically deploys on git push
- Can configure deployment triggers

### Deployment Workflow

```
1. Make changes locally
2. Test thoroughly
3. Commit to feature branch
4. Push to GitHub
5. Create Pull Request
6. Review preview deployment
7. Merge to main
8. Auto-deploy to production
```

## 🎉 Congratulations!

Your Decentralized Freelance Marketplace is now live!

**What's Next?**
1. Share with friends and get feedback
2. Monitor usage and fix issues
3. Add new features
4. Scale as needed
5. Consider mainnet deployment

---

**Remember**: Start with testnet, test thoroughly, then move to mainnet when ready!
