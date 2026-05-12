// controllers/reviewController.js
import Review from '../models/Review.js';
import Job from '../models/Job.js';

// Create a review
export const createReview = async (req, res) => {
    const { jobId, rating, comment, targetUserId } = req.body;
    try {
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const existing = await Review.findOne({ jobId, reviewer: req.user._id });
        if (existing) return res.status(400).json({ message: 'You already reviewed this job' });

        const review = new Review({
            jobId,
            reviewer: req.user._id,
            target: targetUserId,
            rating,
            comment
        });
        await review.save();
        res.status(201).json({ message: 'Review posted successfully', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reviews for a user
export const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ target: req.params.userId })
            .populate('reviewer', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
