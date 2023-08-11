const {StatusCodes} = require('http-status-codes')
const Message = require('../models/message')
const { ObjectId } = require('mongoose').Types;

const createMessage = async (req, res) => {
    try {
        const { content } = req.body
        const message = await Message.create({content})
        res.status(StatusCodes.CREATED).json({ message: "Message created successfully"});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ messages: "Something went wrong" });
    }
}

const getAllMessages = async (req, res) => {
    try {
        // Fetch all messages from the database
        const count = await Message.countDocuments()
        const allMessages = await Message.find().sort({ date: 1 })
        res.status(StatusCodes.OK).json({ messages: allMessages, count });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteAllMessages = async (req, res) => {
    try {
        const result = await Message.deleteMany({});
        const deletedCount = result.deletedCount
        res.status(StatusCodes.OK).json({ message: 'Messages deleted successfully', deletedCount });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteMessage = async (req, res) => {
    try {
        const { messageID } = req.params
        if (!ObjectId.isValid(messageID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid message ID' });
        }
        
        const message = await Message.findById( messageID );
        
        // If the message is not found, return a 404 not found error
        if (!message) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Message not found' });
        }
        
        // remove from the database
        await message.remove();

        res.status(StatusCodes.OK).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}


module.exports = {
    createMessage,
    getAllMessages,
    deleteAllMessages,
    deleteMessage
}