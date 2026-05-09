# 🚀 How to Start Your Decentralized Freelance Marketplace

## 📋 **EVERY TIME YOU WANT TO RUN THE PROJECT**

Follow these steps in order:

---

## 🖥️ **STEP 1: Open 4 Terminals**

You need 4 separate terminals running at the same time.

---

## 🔷 **TERMINAL 1: Start Blockchain (Hardhat Node)**

### Open Terminal 1 and run:

```bash
cd contracts
npx hardhat node
```

### ✅ What you should see:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

... (18 more accounts)
```

### 📝 Important:
- **Keep this terminal running!**
- **Copy Account #0 and Account #1 private keys** - you'll need them for MetaMask
- **Don't close this terminal!**

---

## 🔷 **TERMINAL 2: Deploy Smart Contract**

### Open Terminal 2 (NEW terminal) and run:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

### ✅ What you should see:
```
Deploying FreelanceMarketplace contract...
FreelanceMarketplace deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract address and ABI saved to frontend!
```

### 📝 Important:
- This terminal will finish and close - **that's OK!**
- The contract address is automatically saved to frontend
- You only need to run this once per session

---

## 🔷 **TERMINAL 3: Start Backend**

### Open Terminal 3 (NEW terminal) and run:

```bash
cd backend
npm run dev
```

### ✅ What you should see:
```
[nodemon] 3.1.10
[nodemon] starting `node server.js`
Server running on port 5000
MongoDB Connected ✅
```

### 📝 Important:
- **Keep this terminal running!**
- If you see "MongoDB Connected" - SUCCESS!
- **Don't close this terminal!**

### ❌ If you get errors:
- Make sure MongoDB Atlas is accessible
- Check your internet connection
- Verify `.env` file has correct MongoDB connection string

---

## 🔷 **TERMINAL 4: Start Frontend**

### Open Terminal 4 (NEW terminal) and run:

```bash
cd frontend
npm start
```

### ✅ What you should see:
```
Compiled successfully!

webpack compiled successfully

You can now view freelance-frontend in the browser.

  Local:            http://localhost:3000
```

### 📝 Important:
- **Keep this terminal running!**
- Browser will open automatically at http://localhost:3000
- **Don't close this terminal!**

---

## 🦊 **STEP 2: Setup MetaMask (First Time Only)**

### If MetaMask is already set up, skip to Step 3!

### A. Add Hardhat Local Network

1. Open MetaMask
2. Click network dropdown (top)
3. Click "Add Network" → "Add a network manually"
4. Enter:
   - **Network Name**: `Hardhat Local`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH`
5. Click "Save"
6. **Switch to "Hardhat Local" network**

### B. Import Test Accounts

#### Import Account #0 (Client):
1. Click account icon → "Import Account"
2. Paste private key from Terminal 1 (Account #0)
3. Click "Import"
4. You should see 10,000 ETH!

#### Import Account #1 (Freelancer):
1. Click account icon → "Import Account"
2. Paste private key from Terminal 1 (Account #1)
3. Click "Import"
4. You should see 10,000 ETH!

---

## 🎬 **STEP 3: Test Your Project**

### ✅ **Test 1: Connect Wallet**

1. Go to http://localhost:3000
2. Click **"Connect Wallet"**
3. Approve in MetaMask
4. You should see your wallet address on the page

---

### ✅ **Test 2: Post a Job (as Client)**

1. Make sure you're on **Account #0** (Imported Account 1) in MetaMask
2. Click **"Post Job"** in navigation
3. Fill in:
   - **Description**: `Build a portfolio website`
   - **Payment**: `0.1` (ETH)
4. Click **"Post Job"**
5. Confirm transaction in MetaMask
6. Wait 2-3 seconds
7. You should see **"Job posted successfully!"**

---

### ✅ **Test 3: Browse Jobs**

1. Click **"Browse Jobs"** in navigation
2. You should see your posted job with:
   - Job ID
   - Description
   - Payment amount
   - Client address

---

### ✅ **Test 4: Accept Job (as Freelancer)**

1. **Switch to Account #1** in MetaMask (the second imported account)
2. **Refresh browser** (F5)
3. Click **"Connect Wallet"** again
4. Go to **"Browse Jobs"**
5. Click **"Accept Job"** on the job you posted
6. Confirm transaction in MetaMask
7. Wait 2-3 seconds
8. Job should disappear from browse (now assigned to you)

---

### ✅ **Test 5: View Dashboard**

1. Click **"Dashboard"** in navigation
2. You should see the job you accepted
3. It shows:
   - Your role: Freelancer
   - Job status: In Progress
   - Client address

---

### ✅ **Test 6: Complete Job (as Client)**

1. **Switch back to Account #0** in MetaMask (the client account)
2. **Refresh browser** (F5)
3. Click **"Connect Wallet"** again
4. Go to **"Dashboard"**
5. You should see your job with freelancer assigned
6. Click **"Mark as Complete"**
7. Confirm transaction in MetaMask
8. Wait 2-3 seconds
9. **Payment released!** 0.1 ETH sent to freelancer

---

### ✅ **Test 7: Register User (Optional)**

1. Click **"Register"** in navigation
2. Fill in:
   - **Name**: `Test User`
   - **Email**: `test@example.com`
   - **Password**: `password123`
3. Click **"Register"**
4. You should see success message

---

### ✅ **Test 8: Login (Optional)**

1. Click **"Login"** in navigation
2. Enter:
   - **Email**: `test@example.com`
   - **Password**: `password123`
3. Click **"Login"**
4. You should be logged in

---

### ✅ **Test 9: Send Message (Optional)**

1. Make sure you're logged in
2. Click **"Messages"** in navigation
3. Enter receiver user ID (from MongoDB)
4. Type a message
5. Click **"Send"**
6. Message should be sent

---

## 🛑 **STEP 4: Stop the Project**

When you're done testing:

### Stop Each Terminal:

1. **Terminal 1** (Hardhat): Press `Ctrl + C`
2. **Terminal 3** (Backend): Press `Ctrl + C`
3. **Terminal 4** (Frontend): Press `Ctrl + C`

### Close Browser Tabs:
- Close http://localhost:3000

---

## 🔄 **NEXT TIME YOU START**

Just repeat from **STEP 1**:
1. Start Terminal 1 (Hardhat node)
2. Deploy contract (Terminal 2)
3. Start Terminal 3 (Backend)
4. Start Terminal 4 (Frontend)
5. Connect MetaMask (should remember your accounts)
6. Test!

---

## 📊 **Quick Status Check**

### ✅ Everything is working if you see:

- **Terminal 1**: "Started HTTP and WebSocket JSON-RPC server"
- **Terminal 3**: "MongoDB Connected"
- **Terminal 4**: "Compiled successfully"
- **Browser**: http://localhost:3000 loads
- **MetaMask**: Shows 10,000 ETH on Hardhat Local network

---

## 🆘 **Common Issues**

### Issue 1: "MongoDB Connection Error"
**Solution**: 
- Check internet connection
- Verify MongoDB Atlas is accessible
- Check `backend/.env` has correct connection string

### Issue 2: "Contract Not Found"
**Solution**:
- Make sure Terminal 1 (Hardhat) is running
- Redeploy contract (Terminal 2)
- Restart frontend (Terminal 4)

### Issue 3: "Insufficient Funds"
**Solution**:
- Make sure you're using the imported account (not Account 1)
- Switch to account with 10,000 ETH in MetaMask
- Refresh browser

### Issue 4: "Cannot Accept Own Job"
**Solution**:
- This is correct behavior!
- Switch to a different account (Account #1)
- Then accept the job

### Issue 5: "MetaMask Not Connected"
**Solution**:
- Make sure MetaMask is on "Hardhat Local" network
- Click "Connect Wallet" button
- Approve connection in MetaMask

---

## 💡 **Pro Tips**

1. **Keep all 3 terminals running** (Terminal 1, 3, 4)
2. **Always check MetaMask network** - should be "Hardhat Local"
3. **Use Account #0 for posting jobs** (client)
4. **Use Account #1 for accepting jobs** (freelancer)
5. **Refresh browser after switching accounts**
6. **Check terminal logs** if something doesn't work

---

## 🎓 **For College Demo**

### Before Demo:
1. Start all terminals (5 minutes before)
2. Import both accounts in MetaMask
3. Test once quickly
4. Keep browser ready at localhost:3000

### During Demo:
1. Show homepage and explain concept
2. Connect wallet
3. Post a job (show MetaMask transaction)
4. Switch account and accept job
5. Switch back and complete job
6. Show payment released
7. Explain the blockchain benefits

### Demo Script (5 minutes):
- **Minute 1**: Explain problem and solution
- **Minute 2**: Show wallet connection and post job
- **Minute 3**: Accept job as freelancer
- **Minute 4**: Complete job and release payment
- **Minute 5**: Show dashboard and explain features

---

## 📞 **Need Help?**

If something doesn't work:
1. Check all terminals are running
2. Check MetaMask is on correct network
3. Check you're using the right account
4. Refresh browser
5. Check terminal logs for errors

---

## 🎉 **You're Ready!**

Your complete decentralized freelance marketplace is ready to run and demo!

**Good luck with your college project!** 🌟
