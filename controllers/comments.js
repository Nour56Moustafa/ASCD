const {StatusCodes} = require('http-status-codes')
// import the model here
const {BadRequestError, NotFoundError} = require('../errors')

const createComment = async (req, res) => {
    res.send('create comment route')
}

const getAllComments = async (req, res) => {
    res.send('get all comments route')
}

const updateComment = async (req, res) => {
    res.send('update comment route')
}

const deleteComment = async (req, res) => {
    res.send('delete comment route')
}

module.exports = {
    createComment,
    getAllComments,
    updateComment,
    deleteComment
}