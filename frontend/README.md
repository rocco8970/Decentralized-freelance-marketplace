# Frontend - React Application

React-based frontend for the Decentralized Freelance Marketplace.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start development server
npm start
```

## 📖 Documentation

For complete frontend documentation, see:
- **[Frontend Guide](../docs/03-FRONTEND-GUIDE.md)** - Complete frontend documentation
- **[Setup Guide](../docs/02-SETUP-GUIDE.md)** - Setup instructions
- **[API Reference](../docs/07-API-REFERENCE.md)** - API endpoints
- **[Troubleshooting](../docs/08-TROUBLESHOOTING.md)** - Common issues

## 🔧 Configuration

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=0x5fbdb2315678afecb367f032d93F642f64180aa3
REACT_APP_NETWORK_URL=http://localhost:8545
```

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests

## 📁 Project Structure

```
src/
├── components/     # Reusable components
├── context/        # State management
├── contracts/      # Smart contract ABIs
├── pages/          # Page components
├── utils/          # Utility functions
└── App.js          # Main app component
```

## 🔗 Links

- Main Documentation: [../docs/](../docs/)
- Backend: [../backend/](../backend/)
- Smart Contracts: [../contracts/](../contracts/)
