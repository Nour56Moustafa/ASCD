const express = require('express')
const router = express.Router()

const {
    createComment,
    getAllComments,
    updateComment,
    deleteComment
} = require('../controllers/comments')

router.route('/').post(createComment).get(getAllComments)
router.route('/:id').delete(deleteComment).patch(updateComment)

module.exports = router

