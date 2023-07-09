const {StatusCodes} = require('http-status-codes')
// import the model here
const {BadRequestError, NotFoundError} = require('../errors')

const createMessage = async (req, res) => {
    res.send('create message route')
}

const getAllMessages = async (req, res) => {
    res.send('get all messages route')
}

const deleteAllMessages = async (req, res) => {
    res.send('delete all messages route')
}

const deleteMessage = async (req, res) => {
    res.send('delete message route')
}


module.exports = {
    createMessage,
    getAllMessages,
    deleteAllMessages,
    deleteMessage
}