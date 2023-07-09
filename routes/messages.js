const express = require('express')
const router = express.Router()

const {
    createMessage,
    getAllMessages,
    deleteAllMessages,
    deleteMessage
} = require('../controllers/messages')

router.route('/').post(createMessage).get(getAllMessages).delete(deleteAllMessages)
router.route('/:id').delete(deleteMessage)

module.exports = router
