const express = require('express')
const authenticateUser = require('../middleware/authentication')
const router = express.Router()

const {
    createBlog,
    getAllBlogs,
    getBlog,
    updateBlog,
    deleteBlog
} = require('../controllers/blogs')

router.route('/:id').get(getBlog).delete(authenticateUser, deleteBlog).patch(authenticateUser, updateBlog)
router.route('/').post(authenticateUser, createBlog).get(getAllBlogs)

module.exports = router

