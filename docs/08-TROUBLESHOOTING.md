# Troubleshooting Guide

## 🔍 Common Issues and Solutions

### Frontend Issues

#### MetaMask Not Detected

**Problem:**
```
Please install MetaMask!
```

**Solutions:**
1. Install MetaMask browser extension from [metamask.io](https://metamask.io/download/)
2. Refresh the page after installation
3. Ensure MetaMask is enabled in browser extensions
4. Try a different browser (Chrome, Firefox, Brave)

---

#### Wrong Network

**Problem:**
```
Transaction failed
Network mismatch
```

**Solutions:**
1. Open MetaMask
2. Click network dropdown
3. Select correct network:
   - Local: Hardhat Local (Chain ID: 1337)
   - Testnet: Sepolia (Chain ID: 11155111)
   - Mainnet: Ethereum Mainnet (Chain ID: 1)
4. Refresh the page

---

#### Contract Address Not Found

**Problem:**
```
Error: contract not deployed
Contract address is undefined
```

**Solutions:**
1. Check `.env` file has `REACT_APP_CONTRACT_ADDRESS`
2. Verify contract is deployed:
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network localhost
   ```
3. Copy the deployed contract address to `.env`
4. Restart frontend: `npm start`

---

#### API Connection Error

**Problem:**
```
Network Error
Failed to fetch
```

**Solutions:**
1. Verify backend is running:
   ```bash
   cd backend
   npm run dev
   ```
2. Check `REACT_APP_API_URL` in `.env`
3. Verify CORS is configured on backend
4. Check browser console for detailed error
5. Test API directly:
   ```bash
   curl http://localhost:5000/api/auth/register
   ```

---

#### Build Fails

**Problem:**
```
Error: Module not found
Failed to compile
```

**Solutions:**
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```
2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
3. Check Node.js version (should be 16+):
   ```bash
   node --version
   ```
4. Verify all imports are correct
5. Check for typos in file names

---

### Backend Issues

#### MongoDB Connection Error

**Problem:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
MongoNetworkError
```

**Solutions:**
1. Start MongoDB service:
   ```bash
   # Windows
   mongod
   
   # Mac/Linux
   sudo systemctl start mongod
   ```
2. Verify MongoDB is running:
   ```bash
   mongo --version
   ```
3. Check `MONGO_URI` in `.env`
4. For MongoDB Atlas:
   - Verify connection string
   - Check IP whitelist
   - Verify username/password

---

#### Port Already in Use

**Problem:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Kill process on port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```
2. Or change port in `.env`:
   ```env
   PORT=5001
   ```

---

#### JWT Secret Missing

**Problem:**
```
Error: secretOrPrivateKey must have a value
```

**Solutions:**
1. Add `JWT_SECRET` to `.env`:
   ```env
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```
2. Restart backend

---

#### CORS Error

**Problem:**
```
Access-Control-Allow-Origin header is missing
CORS policy blocked
```

**Solutions:**
1. Install CORS:
   ```bash
   npm install cors
   ```
2. Configure in `server.js`:
   ```javascript
   const cors = require('cors');
   app.use(cors());
   ```
3. For production, specify origins:
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend.vercel.app'],
     credentials: true
   }));
   ```

---

### Smart Contract Issues

#### Contract Not Found

**Problem:**
```
Error: cannot find module 'FreelanceMarketplace'
Contract not compiled
```

**Solutions:**
1. Compile contracts:
   ```bash
   cd contracts
   npx hardhat compile
   ```
2. Verify `artifacts` folder exists
3. Check contract name matches in deploy script

---

#### Network Error

**Problem:**
```
Error: could not detect network
Network connection failed
```

**Solutions:**
1. Ensure Hardhat node is running:
   ```bash
   npx hardhat node
   ```
2. Check network configuration in `hardhat.config.js`
3. Verify RPC URL is correct
4. For testnet, check Infura/Alchemy status

---

#### Insufficient Funds

**Problem:**
```
Error: insufficient funds for intrinsic transaction cost
Insufficient funds for gas
```

**Solutions:**
1. For local network:
   - Import Hardhat account with 10,000 ETH
   - Use account from `npx hardhat node` output
2. For testnet:
   - Get test ETH from faucet
   - Sepolia: https://sepoliafaucet.com
3. For mainnet:
   - Ensure wallet has enough ETH
   - Check gas price and adjust

---

#### Transaction Reverted

**Problem:**
```
Error: transaction reverted
Execution reverted
```

**Solutions:**
1. Check contract requirements:
   - Job must exist
   - Sufficient payment
   - Correct permissions
2. Read error message in MetaMask
3. Verify contract state:
   ```javascript
   const job = await contract.jobs(jobId);
   console.log(job);
   ```
4. Check gas limit

---

### MetaMask Issues

#### Transaction Stuck

**Problem:**
Transaction pending for long time

**Solutions:**
1. Speed up transaction in MetaMask
2. Cancel transaction
3. Reset account:
   - Settings > Advanced > Reset Account
4. Increase gas price for future transactions

---

#### Nonce Too High

**Problem:**
```
Error: nonce too high
```

**Solutions:**
1. Reset MetaMask account:
   - Settings > Advanced > Reset Account
2. This clears transaction history
3. Try transaction again

---

#### Account Not Connected

**Problem:**
Wallet shows as disconnected

**Solutions:**
1. Click "Connect Wallet" button
2. Approve connection in MetaMask
3. Refresh page
4. Check MetaMask is unlocked
5. Verify correct account is selected

---

### Deployment Issues

#### Vercel Build Fails

**Problem:**
```
Build failed
Module not found
```

**Solutions:**
1. Test build locally:
   ```bash
   npm run build
   ```
2. Fix any errors
3. Verify environment variables in Vercel
4. Check Node.js version in Vercel settings
5. Review build logs in Vercel dashboard

---

#### Railway Deployment Fails

**Problem:**
Backend not starting on Railway

**Solutions:**
1. Check logs in Railway dashboard
2. Verify `start` script in `package.json`:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```
3. Verify environment variables
4. Check MongoDB connection string
5. Ensure port is from `process.env.PORT`

---

#### Environment Variables Not Working

**Problem:**
Variables undefined in production

**Solutions:**
1. For React (Vercel):
   - Must start with `REACT_APP_`
   - Add in Vercel dashboard
   - Redeploy after adding
2. For Backend (Railway):
   - Add in Railway dashboard
   - No prefix needed
   - Restart service

---

### Database Issues

#### MongoDB Atlas Connection Fails

**Problem:**
```
MongoNetworkError: connection timed out
```

**Solutions:**
1. Check IP whitelist:
   - Add 0.0.0.0/0 for all IPs
   - Or add specific IPs
2. Verify connection string:
   - Replace `<password>` with actual password
   - Add database name
3. Check MongoDB Atlas status
4. Verify network access settings

---

#### Data Not Persisting

**Problem:**
Data disappears after restart

**Solutions:**
1. For local MongoDB:
   - Ensure MongoDB service is running
   - Check data directory
2. For MongoDB Atlas:
   - Verify connection string
   - Check cluster status
3. Verify database name in connection string

---

## 🔧 Debugging Tips

### Frontend Debugging

1. **Browser Console**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for API calls

2. **React DevTools**
   - Install React DevTools extension
   - Inspect component state
   - Check context values

3. **MetaMask**
   - Check transaction history
   - Verify network
   - Check account balance

### Backend Debugging

1. **Server Logs**
   - Check terminal output
   - Look for error messages
   - Verify API calls

2. **MongoDB**
   - Use MongoDB Compass
   - Check database collections
   - Verify data structure

3. **API Testing**
   - Use Postman or cURL
   - Test endpoints individually
   - Check request/response

### Smart Contract Debugging

1. **Hardhat Console**
   ```bash
   npx hardhat console --network localhost
   ```

2. **Contract Events**
   ```javascript
   contract.on("JobPosted", (jobId, client, description, payment) => {
     console.log("Job posted:", jobId);
   });
   ```

3. **Etherscan**
   - View transaction details
   - Check contract state
   - Read error messages

## 📊 Verification Checklist

### Before Asking for Help

- [ ] Checked error message carefully
- [ ] Searched this troubleshooting guide
- [ ] Verified all services are running
- [ ] Checked environment variables
- [ ] Tested on different browser
- [ ] Cleared cache and cookies
- [ ] Restarted all services
- [ ] Checked network connection
- [ ] Verified correct network in MetaMask
- [ ] Reviewed recent code changes

### Information to Provide

When asking for help, include:
1. Error message (full text)
2. Steps to reproduce
3. Environment (OS, Node version, browser)
4. Network (local, testnet, mainnet)
5. Recent changes made
6. Screenshots if applicable

## 🆘 Getting Help

### Resources

1. **Documentation**
   - Read all docs in `/docs` folder
   - Check component-specific READMEs

2. **Community**
   - Ethereum Stack Exchange
   - Reddit: r/ethdev
   - Discord: Ethereum, Hardhat

3. **Official Docs**
   - React: https://react.dev
   - Ethers.js: https://docs.ethers.org
   - Hardhat: https://hardhat.org/docs
   - Express: https://expressjs.com
   - MongoDB: https://docs.mongodb.com

### Still Stuck?

1. Create detailed issue on GitHub
2. Include all information from checklist
3. Provide minimal reproducible example
4. Be patient and respectful

## 🎯 Prevention Tips

1. **Always test locally first**
2. **Use version control (git)**
3. **Keep dependencies updated**
4. **Document your changes**
5. **Test on testnet before mainnet**
6. **Backup your data**
7. **Monitor logs regularly**
8. **Use environment variables**
9. **Follow security best practices**
10. **Read error messages carefully**
