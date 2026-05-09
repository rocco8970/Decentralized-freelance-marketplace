// routes/authRoutes.js

import { Router } from 'express';
const router = Router();
import { register, login, walletAuth } from '../controllers/authController.js';

// Email/Password
router.post('/register', register);
router.post('/login', login);

// Wallet
router.post('/wallet-auth', walletAuth);

export default router;
