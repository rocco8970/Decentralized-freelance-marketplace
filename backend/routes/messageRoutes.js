// routes/messageRoutes.js

import { Router } from 'express';
const router = Router();
import Message from '../models/Message.js';
import { protect } from '../middleware/authMiddleware.js';

// Send a message
router.post('/send', protect, async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const message = new Message({ 
            senderId: req.user._id, 
            receiverId, 
            content 
        });
        await message.save();
        res.status(201).json({ message: "Message sent", data: message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get messages between two users
router.get('/:user1Id/:user2Id', protect, async (req, res) => {
    try {
        const { user1Id, user2Id } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: user1Id, receiverId: user2Id },
                { senderId: user2Id, receiverId: user1Id }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
