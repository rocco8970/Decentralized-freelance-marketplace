# Backend Guide - Express API

## 📁 Project Structure

```
backend/
├── controllers/           # Business logic
│   ├── authController.js  # Authentication logic
│   ├── jobController.js   # Job management
│   ├── userController.js  # User profile
│   └── messageController.js # Messaging
├── models/               # MongoDB schemas
│   ├── User.js           # User model
│   ├── Job.js            # Job model
│   ├── Message.js        # Message model
│   └── Review.js         # Review model
├── routes/               # API endpoints
│   ├── authRoutes.js     # Auth routes
│   ├── jobRoutes.js      # Job routes
│   ├── userRoutes.js     # User routes
│   └── messageRoutes.js  # Message routes
├── middleware/           # Custom middleware
│   └── authMiddleware.js # JWT authentication
├── config/               # Configuration
│   └── db.js             # Database connection
├── server.js             # Entry point
├── package.json
└── .env                  # Environment variables
```

## 🔧 Technology Stack

- **Express 5.1.0** - Web framework
- **MongoDB** - Database
- **Mongoose 8.14.0** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  walletAddress: String (unique),
  role: "client" | "freelancer",
  createdAt: Date
}
```

### Job Model
```javascript
{
  title: String,
  description: String,
  client: String,
  freelancer: String,
  status: "Open" | "Accepted" | "Completed"
}
```

### Message Model
```javascript
{
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  content: String,
  createdAt: Date
}
```

### Review Model
```javascript
{
  jobId: String,
  reviewer: String,
  target: String,
  rating: Number,
  comment: String
}
```

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)

#### POST /api/auth/register
Register a new user with email/password

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "freelancer"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

#### POST /api/auth/login
Login with email/password

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "freelancer"
  }
}
```

#### POST /api/auth/wallet-auth
Login/Register with wallet address

**Request:**
```json
{
  "walletAddress": "0x1234567890abcdef...",
  "role": "freelancer"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "User_0x1234",
    "walletAddress": "0x1234567890abcdef...",
    "role": "freelancer"
  }
}
```

### User Routes (`/api/users`)

#### GET /api/users/profile
Get current user profile (protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "freelancer"
  }
}
```

### Job Routes (`/api/jobs`)

#### POST /api/jobs
Create a new job

**Request:**
```json
{
  "title": "Build a website",
  "description": "Need a portfolio website",
  "client": "0x1234...",
  "status": "Open"
}
```

**Response:**
```json
{
  "message": "Job created successfully",
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Build a website",
    "description": "Need a portfolio website",
    "client": "0x1234...",
    "status": "Open"
  }
}
```

#### GET /api/jobs
Get all jobs

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Build a website",
    "description": "Need a portfolio website",
    "client": "0x1234...",
    "status": "Open"
  }
]
```

#### POST /api/jobs/:id/accept
Accept a job

**Request:**
```json
{
  "freelancer": "0xabcd..."
}
```

**Response:**
```json
{
  "message": "Job accepted",
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "freelancer": "0xabcd...",
    "status": "Accepted"
  }
}
```

#### POST /api/jobs/:id/complete
Mark job as completed

**Response:**
```json
{
  "message": "Job marked as completed",
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "Completed"
  }
}
```

### Message Routes (`/api/messages`)

#### POST /api/messages/send
Send a message (protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "receiverId": "507f1f77bcf86cd799439012",
  "content": "Hello, how are you?"
}
```

**Response:**
```json
{
  "message": "Message sent",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "507f1f77bcf86cd799439012",
    "content": "Hello, how are you?",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/messages/:user1Id/:user2Id
Get messages between two users (protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "507f1f77bcf86cd799439012",
    "content": "Hello, how are you?",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 🔐 Authentication Middleware

### protect Middleware
Protects routes by verifying JWT token

**Usage:**
```javascript
import { protect } from '../middleware/authMiddleware.js';

router.get('/profile', protect, getProfile);
```

**How it works:**
1. Extracts token from Authorization header
2. Verifies token with JWT_SECRET
3. Fetches user from database
4. Attaches user to req.user
5. Calls next() or returns 401

## 🚀 Running the Backend

### Development
```bash
npm run dev
```
Runs with nodemon (auto-restart on changes)

### Production
```bash
npm start
```
Runs with node

## 🔧 Configuration

### Environment Variables (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/freelance-marketplace
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### CORS Configuration
```javascript
app.use(cors()); // Allow all origins in development

// Production:
app.use(cors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true
}));
```

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds of 12
2. **JWT Authentication**: 7-day expiration
3. **Protected Routes**: Middleware verification
4. **Input Validation**: Mongoose schema validation
5. **CORS**: Configured for security

## 🐛 Common Issues

**MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service

**JWT Secret Missing**
```
Error: secretOrPrivateKey must have a value
```
**Solution**: Set JWT_SECRET in .env

**Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process on port 5000 or change PORT in .env

## 📚 Additional Resources

- Express Documentation: https://expressjs.com
- MongoDB Documentation: https://docs.mongodb.com
- Mongoose Documentation: https://mongoosejs.com
- JWT Documentation: https://jwt.io
