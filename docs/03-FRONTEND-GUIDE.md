# Frontend Guide - React Application

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   └── Navbar.js       # Navigation bar
│   ├── context/            # State management
│   │   ├── AuthContext.js  # Authentication state
│   │   └── WalletContext.js # Wallet connection state
│   ├── contracts/          # Smart contract ABIs
│   │   ├── contractAddress.js
│   │   └── freelanceMarketplaceABI.json
│   ├── pages/              # Page components
│   │   ├── Home.js         # Landing page
│   │   ├── Login.js        # User login
│   │   ├── Register.js     # User registration
│   │   ├── Dashboard.js    # User dashboard
│   │   ├── PostJob.js      # Create new jobs
│   │   ├── BrowseJobs.js   # View and accept jobs
│   │   └── Messages.js     # Messaging system
│   ├── utils/              # Utility functions
│   │   └── contract.js     # Smart contract helpers
│   ├── App.js              # Main app with routing
│   ├── App.css             # Global styles
│   ├── index.js            # Entry point
│   └── index.css           # Base styles
├── public/                 # Static files
├── package.json
└── .env                    # Environment variables
```

## 🔧 Technology Stack

- **React 19.1.0** - UI framework
- **React Router DOM 7.5.2** - Routing
- **Ethers.js 6.14.1** - Blockchain interaction
- **Axios 1.9.0** - HTTP client
- **Framer Motion 11.0.0** - Animations and page transitions
- **React Toastify 11.0.5** - Toast notifications

## 🎯 Key Features

### 1. Wallet Integration (WalletContext)
- Detects MetaMask installation
- Connects to user's Ethereum wallet
- Manages wallet state and account changes
- Provides contract address to components

### 2. Authentication (AuthContext)
- Handles user registration and login via backend API
- Manages JWT tokens in localStorage
- Provides user profile information
- Handles logout functionality

### 3. Smart Contract Interaction
- Uses ethers.js v6 for blockchain communication
- Connects to deployed FreelanceMarketplace contract
- Key functions:
  - `postJob(description, payment)`: Create a new job
  - `acceptJob(jobId)`: Accept an available job
  - `completeJob(jobId)`: Mark job as completed (client only)
  - `jobs(jobId)`: Fetch job details

## 📄 Page Components

### Home.js - Landing Page
**Features:**
- Welcome message and feature showcase
- Wallet connection prompt
- Quick action buttons
- Responsive design

### PostJob.js - Create New Job
**Features:**
- Job description textarea
- Payment amount input
- Form validation
- Wallet connection check
- Loading states during transaction

**Usage:**
```javascript
1. User fills job description
2. Enters payment amount (e.g., 0.5 ETH)
3. Clicks "Post Job"
4. MetaMask prompts for confirmation
5. Transaction sent to blockchain
6. Success message displayed
```

### BrowseJobs.js - View Available Jobs
**Features:**
- Lists all open jobs from blockchain
- Shows job details (ID, description, payment, client)
- Accept job functionality
- Refresh button
- Loading states

**Job Filtering:**
```javascript
// Only shows jobs that are:
// - Not completed
// - No freelancer assigned
if (!job.completed && job.freelancer === ethers.ZeroAddress) {
  // Job is available
}
```

### Dashboard.js - User's Job Management
**Features:**
- Shows all jobs where user is client OR freelancer
- Job details and status
- Complete button (for clients)
- Color-coded job cards
- Refresh functionality

**Role Detection:**
```javascript
const isClient = job.client.toLowerCase() === currentAccount.toLowerCase();
const isFreelancer = job.freelancer.toLowerCase() === currentAccount.toLowerCase();
```

### Login.js & Register.js - Authentication
**Features:**
- Email/password forms
- Loading states
- Navigation after success
- Error handling
- Disabled states during submission

### Messages.js - User Messaging
**Features:**
- Message bubbles
- Timestamp display
- Loading states
- Authentication check
- Send message functionality

## 🔄 State Management

### Global State (Context API)

**AuthContext:**
```javascript
{
  user: { _id, name, email },
  loading: boolean,
  login: function,
  register: function,
  logout: function
}
```

**WalletContext:**
```javascript
{
  currentAccount: "0x1234...",
  isConnecting: boolean,
  contractAddress: "0x5678...",
  connectWallet: function
}
```

## 🔗 Smart Contract Integration

### Contract Helper (utils/contract.js)

```javascript
export const getContract = async () => {
  // Get MetaMask provider
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // Get user's signer (for transactions)
  const signer = await provider.getSigner();
  
  // Create contract instance
  return new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
}
```

### Usage in Components:

```javascript
// Read data (no transaction)
const contract = await getContract();
const jobCount = await contract.jobCount();

// Write data (transaction)
const contract = await getContract();
const tx = await contract.postJob("description", { 
  value: ethers.parseEther("0.5") 
});
await tx.wait(); // Wait for confirmation
```

## 🎨 User Interface

### Current Design
- Simple, functional design
- Basic styling with inline styles
- Responsive layout
- Color-coded job status
- Loading indicators

### Key UI Elements
1. **Buttons**: Action triggers
2. **Forms**: Data input
3. **Lists**: Data display
4. **Cards**: Job information containers
5. **Navigation**: Page routing

## 🔒 Security Features

### Client-Side Security
1. **No Private Keys**: MetaMask handles all keys
2. **Token Storage**: JWT in localStorage (cleared on logout)
3. **Input Validation**: All forms validate inputs
4. **Environment Variables**: Secrets in .env (not committed)

### Blockchain Security
1. **Transaction Review**: Users see details before signing
2. **Address Verification**: Contract address validated
3. **Amount Validation**: ETH amounts checked
4. **Network Verification**: Ensures correct network

## 📊 Data Models

### Job Object (from blockchain)
```javascript
{
  id: 0,
  client: "0x1234...",
  freelancer: "0xabcd...",
  description: "Build...",
  payment: "500000000...", // Wei
  completed: false
}
```

### User Object (from backend)
```javascript
{
  _id: "507f1f77...",
  name: "John Doe",
  email: "john@example.com"
}
```

## 🚀 Running the Frontend

### Development
```bash
npm start
```
Opens at http://localhost:3000

### Production Build
```bash
npm run build
```
Creates optimized build in `build/` folder

### Testing
```bash
npm test
```

## 🔧 Configuration

### Environment Variables (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_NETWORK_URL=http://localhost:8545
```

## 🐛 Common Issues

**MetaMask not detected**
- Ensure MetaMask extension is installed
- Refresh the page after installing

**Transaction failures**
- Check you're on the correct network
- Ensure you have enough ETH for gas fees
- Verify contract address is correct

**API connection errors**
- Verify backend is running
- Check `REACT_APP_API_URL` in `.env`
- Ensure CORS is configured on backend

## 📚 Additional Resources

- React Documentation: https://react.dev
- Ethers.js Documentation: https://docs.ethers.org
- MetaMask Documentation: https://docs.metamask.io
