const Message = require('../models/messageModel');
//-----------------------------------------------------------------------
exports.createMessage = async (req, res) => {
    try {
        const { name, email, phoneNumber, message } = req.body;
        if (!name || !email ||!phoneNumber|| !message) {
            return res.status(400).json({ message: 'Missing required fields: name, email, phone number and message' });
        }

        // Create a new message document and save it to the database
        const newMessage = new Message({ name, email, phoneNumber, message });
        await newMessage.save();

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
};

exports.getAllMessages = async(req, res) => {
    try {
        const messages = await Message.find({});
        const messageTexts = messages.map(message => message.name + ":  " + message.message + ".    Sent From: " + message.email);
        res.status(200).json(messageTexts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching messages' });
    }
};

exports.getMessageById = async(req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching message' });
    }
};