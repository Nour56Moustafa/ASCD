const express = require('express')
const authenticateUser = require('../middleware/authentication')
const router = express.Router()

const {
    createBlog,
    getAllBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    manageLikes,
    getLikedBlogs,
} = require('../controllers/blogs')

router.route('/')
    .post(authenticateUser, createBlog)
    .get(getAllBlogs)
router.route('/liked')
    .get(authenticateUser, getLikedBlogs)
router.route('/:blogID')
    .get(getBlog)
    .delete(authenticateUser, deleteBlog)
    .patch(authenticateUser, updateBlog)
    .post(authenticateUser, manageLikes)


module.exports = router

