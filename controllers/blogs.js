const {StatusCodes} = require('http-status-codes')
// import the model here
const {BadRequestError, NotFoundError} = require('../errors')

const createBlog = async (req, res) => {
    res.send('create blog route')
}

const getAllBlogs = async (req, res) => {
    res.send('get all blogs route')
}

const getBlog = async (req, res) => {
    res.send('get single blog route')
}

const updateBlog = async (req, res) => {
    res.send('update blog route')
}

const deleteBlog = async (req, res) => {
    res.send('delete blog route')
}

module.exports = {
    createBlog,
    getAllBlogs,
    getBlog,
    updateBlog,
    deleteBlog
}