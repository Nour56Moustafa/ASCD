const express = require('express')
const router = express.Router()
const isAdmin = require('../middleware/is-admin')

const {
    createMessage,
    getAllMessages,
    deleteAllMessages,
    deleteMessage
} = require('../controllers/messages')

router.route('/').post(createMessage)
//router.use(isAdmin)
router.route('/').get(getAllMessages).delete(deleteAllMessages)
router.route('/:messageID').delete(deleteMessage)

module.exports = router
