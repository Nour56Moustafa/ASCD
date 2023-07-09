const {StatusCodes} = require('http-status-codes')
// import the model here
const {BadRequestError, NotFoundError} = require('../errors')

const searchUser = async (req, res) => {
    res.send('search user route')
}

const updateUser = async (req, res) => {
    res.send('update user route')
}

const deleteUser = async (req, res) => {
    res.send('delete user route')
}


module.exports = {
    searchUser,
    updateUser,
    deleteUser
}