// routes/reviewRoutes.js
import { Router } from 'express';
import { createReview, getUserReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, createReview);
router.get('/user/:userId', getUserReviews);

export default router;
