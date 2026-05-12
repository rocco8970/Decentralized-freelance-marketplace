# 🗄️ MongoDB Setup Guide - Step by Step

## 📊 CHOOSE YOUR OPTION

| Option | Best For | Time | Cost |
|--------|----------|------|------|
| **Local MongoDB** | Development & Testing | 5 min | Free |
| **MongoDB Atlas** | Production & Cloud | 10 min | Free tier available |

---

## ✅ OPTION 1: LOCAL MONGODB (EASIEST FOR DEVELOPMENT)

### Step 1: Download MongoDB Community Edition

#### Windows:
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - **Version:** Latest (e.g., 7.0.x)
   - **OS:** Windows x64
   - **Package:** MSI
3. Click **Download**
4. Run the installer (.msi file)

#### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### Linux (Ubuntu):
```bash
curl -fsSL https://www.mongodb.com/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

---

### Step 2: Verify Installation

```bash
# Check MongoDB version
mongod --version
```

Expected output:
```
db version v7.0.x
Build Info: {...}
```

---

### Step 3: Start MongoDB Service

#### Windows (GUI):
1. MongoDB installs as a Windows Service automatically
2. Open Services (services.msc)
3. Find "MongoDB Server"
4. Check if status is "Running"
5. If not, right-click → Start

#### Windows (Terminal):
```bash
# Start MongoDB
mongod

# OR if installed as service
net start MongoDB
```

#### macOS/Linux:
```bash
# Start MongoDB
brew services start mongodb-community

# OR
mongod
```

✅ You should see: `waiting for connections on port 27017`

---

### Step 4: Test Connection

Open a NEW terminal and run:

```bash
# Connect to MongoDB
mongosh

# OR (older version)
mongo
```

You should see:
```
test>
```

Test command:
```javascript
db.version()
// Returns: 7.0.x
```

Type `exit` to quit.

---

### Step 5: Verify Backend Can Connect

Your `.env` is already set up for local MongoDB:
```env
MONGO_URI=mongodb://localhost:27017/freelance-marketplace
```

Start the backend:
```bash
cd backend
npm run dev
```

✅ You should see: **"MongoDB Connected"**

---

## 🌐 OPTION 2: MONGODB ATLAS (CLOUD - RECOMMENDED FOR PRODUCTION)

### Step 1: Create MongoDB Atlas Account

1. Go to: https://account.mongodb.com/account/register
2. Sign up with:
   - Email address
   - Password (strong one!)
   - Accept terms
3. Click **Create your Atlas account**

---

### Step 2: Create Organization & Project

1. **Create Organization:**
   - Organization Name: `Freelance Marketplace`
   - Click **Create Organization**

2. **Create Project:**
   - Project Name: `Freelance-Dev`
   - Click **Create Project**

---

### Step 3: Create a Cluster

1. Click **Build a Database**
2. Choose deployment option:
   - Select **M0 FREE** tier (green button)
   - This gives you 512MB storage - perfect for testing
3. Choose cloud provider & region:
   - Provider: AWS (or your preference)
   - Region: Pick closest to you
   - Tier: M0 Sandbox (Free)
4. Click **Create Deployment**
5. **Wait 1-3 minutes** for cluster to build

---

### Step 4: Configure Database Access

1. In left sidebar → **Database Access**
2. Click **Add New Database User**
3. Fill in:
   - **Username:** `freelance_admin`
   - **Password:** Generate secure password
     - Click **Auto Generate Secure Password**
     - Save the password! (you'll need it)
   - **Built-in Role:** Select "Read and write to any database"
4. Click **Add User**

✅ User created successfully

---

### Step 5: Configure Network Access

1. In left sidebar → **Network Access**
2. Click **Add IP Address**
3. For development: 
   - Click **Allow Access from Anywhere**
   - Click **Confirm**
4. For production (later):
   - Add specific IP addresses
   - Add your deployment server IP

✅ Network access configured

---

### Step 6: Get Connection String

1. Click **Databases** in left sidebar
2. You should see your cluster
3. Click **Connect** button
4. Choose **Drivers**
5. Select:
   - Driver: **Node.js**
   - Version: **5.5 or later**
6. Copy the connection string:
   ```
   mongodb+srv://freelance_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

⚠️ **Replace `<password>` with the password you generated!**

---

### Step 7: Update Your .env File

Edit `backend/.env`:

**Before:**
```env
MONGO_URI=mongodb://localhost:27017/freelance-marketplace
```

**After:**
```env
MONGO_URI=mongodb+srv://freelance_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/freelance-marketplace?retryWrites=true&w=majority
```

Replace:
- `YOUR_PASSWORD` → Your actual password
- `cluster0.xxxxx` → Your cluster name from connection string

---

### Step 8: Test Connection

Start the backend:
```bash
cd backend
npm run dev
```

✅ You should see: **"MongoDB Connected"**

---

## 🔍 VERIFY MONGODB IS WORKING

### Test 1: Check MongoDB Service

**Windows:**
```bash
# Check if running
netstat -ano | findstr :27017
```

Should show: `LISTENING`

**macOS/Linux:**
```bash
# Check if running
lsof -i :27017
```

Should show: `mongod`

---

### Test 2: Connect with Database Client

#### Using MongoDB Compass (GUI):

1. Download: https://www.mongodb.com/products/tools/compass
2. Install and open
3. Connection String:
   - **Local:** `mongodb://localhost:27017`
   - **Atlas:** Your connection string from Step 6
4. Click **Connect**
5. You should see your database

✅ You can see all databases and collections

---

### Test 3: Check Backend Connection

```bash
cd backend
npm run dev
```

Look for console output:
```
MongoDB Connected
Server running on port 5000
```

---

## 📋 MONGODB SETUP CHECKLIST

### Local MongoDB
- [ ] Downloaded from mongodb.com
- [ ] Installation completed
- [ ] `mongod --version` works
- [ ] Service is running (port 27017)
- [ ] `mongosh` connects successfully
- [ ] Backend shows "MongoDB Connected"

### MongoDB Atlas
- [ ] Account created at mongodb.com
- [ ] Organization created
- [ ] Project created
- [ ] Free tier cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string copied
- [ ] Password in connection string
- [ ] `.env` file updated with connection string
- [ ] Backend shows "MongoDB Connected"

---

## 🆘 TROUBLESHOOTING

### Issue: "mongod: command not found"
**Solution:**
- MongoDB not installed or not in PATH
- Windows: Check Services (services.msc) for "MongoDB Server"
- macOS/Linux: Reinstall using brew or package manager

### Issue: "Connection refused on port 27017"
**Solution:**
- MongoDB service not running
- Start with: `mongod` (Windows) or `brew services start mongodb-community` (macOS)
- Wait a few seconds for it to start

### Issue: "Failed to connect to MongoDB"
**Solution for Local:**
- Check `MONGO_URI` in `.env` is: `mongodb://localhost:27017/freelance-marketplace`
- Check MongoDB is running

**Solution for Atlas:**
- Check password is correct (no special characters need escaping)
- Check IP address is whitelisted (Network Access)
- Check internet connection
- Copy connection string again

### Issue: "Authentication failed"
**Solution:**
- Check username and password in connection string
- Verify password matches what you set
- If forgotten, create new database user in Atlas

### Issue: "MongoServerError: connect ECONNREFUSED"
**Solution:**
- MongoDB service not running
- Start the service first
- Then start backend
- Check port 27017 is not blocked by firewall

---

## 📊 WHAT HAPPENS NEXT

Once MongoDB is connected, your backend will:

1. ✅ Create database: `freelance-marketplace`
2. ✅ Create collections:
   - `users` - Store user accounts
   - `jobs` - Store job postings
   - `messages` - Store messages
   - `reviews` - Store job reviews
3. ✅ Ready for frontend to connect

---

## 🎯 RECOMMENDED SETUP

**For Development (Right Now):**
→ Use **Local MongoDB** (easier, no account needed)

**For Production (Later):**
→ Use **MongoDB Atlas** (cloud, scalable, free tier available)

---

## ✨ QUICK START COMMANDS

### Local MongoDB
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend (waits for MongoDB)
cd backend
npm run dev
```

### MongoDB Atlas
```bash
# Just update .env with connection string
# Then start backend
cd backend
npm run dev
```

---

**Next Step:** Choose one option above and follow the steps!  
**Questions?** Check the troubleshooting section above.

Created: May 9, 2026
