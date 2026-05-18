# API Reference - Complete Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-app.up.railway.app/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Detailed error"
}
```

## Authentication Endpoints

### POST /api/auth/register
Register a new user with email and password.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "freelancer"  // Optional: "client" or "freelancer"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully"
}
```

**Errors:**
- `400 Bad Request`: User already exists
- `500 Internal Server Error`: Server error

---

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
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

**Errors:**
- `404 Not Found`: User not found
- `400 Bad Request`: Invalid credentials
- `500 Internal Server Error`: Server error

---

### POST /api/auth/wallet-auth
Login or register with wallet address.

**Request Body:**
```json
{
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "role": "freelancer"  // Optional: "client" or "freelancer"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "User_0x1234",
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "role": "freelancer"
  }
}
```

**Errors:**
- `500 Internal Server Error`: Server error

---

## User Endpoints

### GET /api/users/profile
Get current user profile. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "role": "freelancer",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `401 Unauthorized`: No token or invalid token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

---

## Job Endpoints

### POST /api/jobs
Create a new job.

**Request Body:**
```json
{
  "title": "Build a website",
  "description": "Need a portfolio website with React",
  "client": "0x1234567890abcdef1234567890abcdef12345678",
  "status": "Open"  // Optional: defaults to "Open"
}
```

**Response:** `201 Created`
```json
{
  "message": "Job created successfully",
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Build a website",
    "description": "Need a portfolio website with React",
    "client": "0x1234567890abcdef1234567890abcdef12345678",
    "status": "Open"
  }
}
```

**Errors:**
- `500 Internal Server Error`: Failed to create job

---

### GET /api/jobs
Get all jobs.

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Build a website",
    "description": "Need a portfolio website with React",
    "client": "0x1234567890abcdef1234567890abcdef12345678",
    "freelancer": null,
    "status": "Open"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Design a logo",
    "description": "Need a modern logo for my startup",
    "client": "0xabcdef1234567890abcdef1234567890abcdef12",
    "freelancer": "0x9876543210fedcba9876543210fedcba98765432",
    "status": "Accepted"
  }
]
```

**Errors:**
- `500 Internal Server Error`: Failed to fetch jobs

---

### POST /api/jobs/:id/accept
Accept a job.

**URL Parameters:**
- `id`: Job ID

**Request Body:**
```json
{
  "freelancer": "0x9876543210fedcba9876543210fedcba98765432"
}
```

**Response:** `200 OK`
```json
{
  "message": "Job accepted",
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Build a website",
    "description": "Need a portfolio website with React",
    "client": "0x1234567890abcdef1234567890abcdef12345678",
    "freelancer": "0x9876543210fedcba9876543210fedcba98765432",
    "status": "Accepted"
  }
}
```

**Errors:**
- `404 Not Found`: Job not found
- `500 Internal Server Error`: Failed to accept job

---

### POST /api/jobs/:id/complete
Mark a job as completed.

**URL Parameters:**
- `id`: Job ID

**Response:** `200 OK`
```json
{
  "message": "Job marked as completed",
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Build a website",
    "description": "Need a portfolio website with React",
    "client": "0x1234567890abcdef1234567890abcdef12345678",
    "freelancer": "0x9876543210fedcba9876543210fedcba98765432",
    "status": "Completed"
  }
}
```

**Errors:**
- `404 Not Found`: Job not found
- `500 Internal Server Error`: Failed to complete job

---

## Message Endpoints

### POST /api/messages/send
Send a message. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "receiverId": "507f1f77bcf86cd799439012",
  "content": "Hello, I'm interested in your job posting."
}
```

**Response:** `201 Created`
```json
{
  "message": "Message sent",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "507f1f77bcf86cd799439012",
    "content": "Hello, I'm interested in your job posting.",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `401 Unauthorized`: No token or invalid token
- `500 Internal Server Error`: Failed to send message

---

### GET /api/messages/:user1Id/:user2Id
Get messages between two users. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `user1Id`: First user ID
- `user2Id`: Second user ID

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "507f1f77bcf86cd799439012",
    "content": "Hello, I'm interested in your job posting.",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "senderId": "507f1f77bcf86cd799439012",
    "receiverId": "507f1f77bcf86cd799439011",
    "content": "Great! Let's discuss the details.",
    "createdAt": "2024-01-01T00:05:00.000Z"
  }
]
```

**Errors:**
- `401 Unauthorized`: No token or invalid token
- `500 Internal Server Error`: Failed to fetch messages

---

## Review Endpoints

### POST /api/reviews
Create a review for a completed job. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "jobId": "0",
  "target": "0x9876543210fedcba9876543210fedcba98765432",
  "rating": 5,
  "comment": "Excellent work, delivered on time!"
}
```

**Response:** `201 Created`
```json
{
  "message": "Review created",
  "review": {
    "_id": "507f1f77bcf86cd799439014",
    "jobId": "0",
    "reviewer": "0x1234567890abcdef1234567890abcdef12345678",
    "target": "0x9876543210fedcba9876543210fedcba98765432",
    "rating": 5,
    "comment": "Excellent work, delivered on time!"
  }
}
```

**Errors:**
- `401 Unauthorized`: No token or invalid token
- `500 Internal Server Error`: Failed to create review

---

### GET /api/reviews/user/:userId
Get all reviews for a specific user.

**URL Parameters:**
- `userId`: The wallet address or user ID to query reviews for

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "jobId": "0",
    "reviewer": "0x1234567890abcdef1234567890abcdef12345678",
    "target": "0x9876543210fedcba9876543210fedcba98765432",
    "rating": 5,
    "comment": "Excellent work, delivered on time!"
  }
]
```

**Errors:**
- `500 Internal Server Error`: Failed to fetch reviews

---

## Health Endpoint

### GET /api/health
Check if the API is running.

**Response:** `200 OK`
```json
{
  "status": "ok",
  "message": "FreelanceChain API running"
}
```

---

## Smart Contract Functions

### postJob(description) payable
Create a new job on the blockchain.

**Parameters:**
- `description` (string): Job description
- `value` (uint256): Payment amount in Wei

**Example:**
```javascript
const tx = await contract.postJob("Build a website", {
  value: ethers.parseEther("0.5")
});
await tx.wait();
```

**Events Emitted:**
```solidity
JobPosted(uint256 indexed jobId, address indexed client, string description, uint256 payment)
```

---

### acceptJob(jobId)
Accept an available job.

**Parameters:**
- `jobId` (uint256): Job ID

**Example:**
```javascript
const tx = await contract.acceptJob(0);
await tx.wait();
```

**Events Emitted:**
```solidity
JobAccepted(uint256 indexed jobId, address indexed freelancer)
```

---

### completeJob(jobId)
Mark job as complete and release payment.

**Parameters:**
- `jobId` (uint256): Job ID

**Example:**
```javascript
const tx = await contract.completeJob(0);
await tx.wait();
```

**Events Emitted:**
```solidity
JobCompleted(uint256 indexed jobId, address indexed freelancer, uint256 payment)
```

---

### jobs(jobId) view
Get job details.

**Parameters:**
- `jobId` (uint256): Job ID

**Returns:**
```solidity
struct Job {
  uint256 id;
  address payable client;
  address payable freelancer;
  string description;
  uint256 payment;
  bool completed;
}
```

**Example:**
```javascript
const job = await contract.jobs(0);
console.log(job.description);
```

---

### jobCount() view
Get total number of jobs.

**Returns:**
- `uint256`: Total job count

**Example:**
```javascript
const count = await contract.jobCount();
```

---

### getAllJobs() view
Get all jobs as an array.

**Returns:**
- `Job[]`: Array of all jobs

**Example:**
```javascript
const allJobs = await contract.getAllJobs();
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## CORS Configuration

Configure CORS to allow your frontend domain:

```javascript
const corsOptions = {
  origin: ['https://your-frontend.vercel.app'],
  credentials: true
};

app.use(cors(corsOptions));
```

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Profile
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables
3. Test each endpoint
4. Save responses for documentation

## Additional Resources

- Express Documentation: https://expressjs.com
- MongoDB Documentation: https://docs.mongodb.com
- JWT Documentation: https://jwt.io
- Ethers.js Documentation: https://docs.ethers.org
