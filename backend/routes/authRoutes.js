// routes/authRoutes.js
import { Router } from 'express';
import { register, login, walletAuth } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = Router();

// Email/Password
router.post('/register', register);
router.post('/login', login);

// Wallet
router.post('/wallet-auth', walletAuth);

// Profile (kept here for backward compat)
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
