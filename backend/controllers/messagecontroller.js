// controllers/messageController.js
import Message from '../models/Message.js';

// Send Message
export const sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;
    try {
        const newMessage = new Message({
            senderId: req.user._id,
            receiverId,
            content
        });
        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Messages between two users
export const getMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.user._id, receiverId: userId },
                { senderId: userId, receiverId: req.user._id }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
