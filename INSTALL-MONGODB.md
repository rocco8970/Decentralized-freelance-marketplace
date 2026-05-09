# Install MongoDB on Windows - Simple Steps

## Method 1: Using Chocolatey (Easiest - Recommended)

### Step 1: Install Chocolatey (if not installed)
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Step 2: Install MongoDB
```powershell
choco install mongodb
```

### Step 3: Start MongoDB
```powershell
mongod
```

---

## Method 2: Manual Download (Alternative)

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: 8.0.x (latest)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install
1. Run the downloaded .msi file
2. Choose "Complete" installation
3. Check "Install MongoDB as a Service"
4. Click "Next" and "Install"

### Step 3: Verify Installation
Open Command Prompt and run:
```bash
mongod --version
```

---

## Method 3: Use MongoDB Atlas (Cloud - No Installation)

If you don't want to install MongoDB locally, use MongoDB Atlas (free cloud database):

### Step 1: Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select region closest to you
4. Click "Create"

### Step 3: Get Connection String
1. Click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Save it for later (you'll need it in backend/.env)

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/freelance-marketplace
```

---

## Which Method Should You Choose?

- **For College Demo**: Method 1 or 2 (local installation)
- **For Quick Start**: Method 3 (MongoDB Atlas - no installation)
- **Recommended**: Method 1 (Chocolatey - easiest)

---

## After Installation

Once MongoDB is installed, come back and we'll continue with the next steps!
