# 🚀 START YOUR PROJECT - Simple Steps

## ✅ Configuration Complete!

All your environment files are set up:
- ✅ Backend configured with MongoDB Atlas
- ✅ Frontend configured
- ✅ Contracts configured

---

## 📍 **STEP-BY-STEP: Start Your Project**

### **You Need 4 Terminals Open**

I'll guide you through each one!

---

## 🖥️ **TERMINAL 1: Start Smart Contract (Blockchain)**

### Open Terminal 1 and run:

```bash
cd contracts
npx hardhat node
```

**What you'll see:**
- Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
- 20 accounts with 10000 ETH each
- Private keys for each account

**IMPORTANT:** 
- Keep this terminal running!
- Copy one of the private keys (you'll need it for MetaMask)
- Don't close this terminal!

**Status:** ⏳ Leave this running...

---

## 🖥️ **TERMINAL 2: Deploy Smart Contract**

### Open Terminal 2 (NEW terminal) and run:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

**What you'll see:**
```
Deploying FreelanceMarketplace contract...
FreelanceMarketplace deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract address and ABI saved to frontend!
```

**IMPORTANT:**
- Copy the contract address (starts with 0x...)
- This terminal will finish and close - that's OK!

**Status:** ✅ Done! (Terminal closes automatically)

---

## 🖥️ **TERMINAL 3: Start Backend**

### Open Terminal 3 (NEW terminal) and run:

```bash
cd backend
npm run dev
```

**What you'll see:**
```
Server running on port 5000
MongoDB Connected
```

**IMPORTANT:**
- Keep this terminal running!
- If you see "MongoDB Connected" - SUCCESS! ✅
- Don't close this terminal!

**Status:** ⏳ Leave this running...

---

## 🖥️ **TERMINAL 4: Start Frontend**

### Open Terminal 4 (NEW terminal) and run:

```bash
cd frontend
npm start
```

**What you'll see:**
- Compiling...
- Compiled successfully!
- Browser opens automatically at http://localhost:3000

**IMPORTANT:**
- Keep this terminal running!
- Browser will open automatically
- Don't close this terminal!

**Status:** ⏳ Leave this running...

---

## 🎉 **SUCCESS! Your Project is Running!**

You should now have:
- ✅ Terminal 1: Blockchain running (Hardhat node)
- ✅ Terminal 2: Contract deployed (closed)
- ✅ Terminal 3: Backend running (port 5000)
- ✅ Terminal 4: Frontend running (port 3000)
- ✅ Browser: Opened at http://localhost:3000

---

## 🦊 **NEXT: Setup MetaMask**

### Step 1: Install MetaMask
- Go to: https://metamask.io/download/
- Install the browser extension
- Create a wallet (or import existing)

### Step 2: Add Local Network
1. Open MetaMask
2. Click network dropdown (top)
3. Click "Add Network" → "Add a network manually"
4. Enter:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
5. Click "Save"

### Step 3: Import Test Account
1. Go back to Terminal 1 (Hardhat node)
2. Copy one of the private keys
3. In MetaMask: Click account icon → "Import Account"
4. Paste the private key
5. Click "Import"

**You should now have 10000 ETH!** 🎉

---

## 🎬 **READY TO TEST!**

Go to http://localhost:3000 and:
1. Click "Connect Wallet"
2. Approve in MetaMask
3. Try posting a job!

---

## 🆘 **If Something Goes Wrong**

### Backend won't start?
- Check if MongoDB Atlas connection string is correct in `backend/.env`
- Make sure you replaced the password correctly

### Frontend won't start?
- Check if backend is running first
- Make sure you're in the `frontend` folder

### Can't connect wallet?
- Make sure MetaMask is installed
- Make sure you added the Hardhat Local network
- Make sure Hardhat node (Terminal 1) is running

---

## 📞 **Need Help?**

Tell me:
1. Which terminal/step you're on
2. What error you're seeing
3. What the terminal shows

I'm here to help! 😊
