const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')

const {
    createComment,
    getAllComments,
    updateComment,
    deleteComment
} = require('../controllers/comments')

router.route('/:blogId').post(authenticateUser, createComment).get(getAllComments)
router.route('/:commentId').delete(authenticateUser, deleteComment).patch(authenticateUser, updateComment)

module.exports = router