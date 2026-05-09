# Backend - Express API

Express.js backend API for the Decentralized Freelance Marketplace.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev
```

## 📖 Documentation

For complete backend documentation, see:
- **[Backend Guide](../docs/04-BACKEND-GUIDE.md)** - Complete backend documentation
- **[Setup Guide](../docs/02-SETUP-GUIDE.md)** - Setup instructions
- **[API Reference](../docs/07-API-REFERENCE.md)** - API endpoints
- **[Troubleshooting](../docs/08-TROUBLESHOOTING.md)** - Common issues

## 🔧 Configuration

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/freelance-marketplace
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

## 🛠️ Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server (with nodemon)

## 📁 Project Structure

```
backend/
├── controllers/    # Business logic
├── models/         # MongoDB schemas
├── routes/         # API endpoints
├── middleware/     # Custom middleware
├── config/         # Configuration
└── server.js       # Entry point
```

## 🌐 API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/wallet-auth` - Wallet authentication
- `GET /api/users/profile` - Get user profile
- `POST /api/jobs` - Create job
- `GET /api/jobs` - Get all jobs
- `POST /api/messages/send` - Send message
- `GET /api/messages/:user1Id/:user2Id` - Get messages

See [API Reference](../docs/07-API-REFERENCE.md) for complete documentation.

## 🔗 Links

- Main Documentation: [../docs/](../docs/)
- Frontend: [../frontend/](../frontend/)
- Smart Contracts: [../contracts/](../contracts/)
