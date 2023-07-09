const express = require('express')
const router = express.Router()

const {
    searchUser,
    updateUser,
    deleteUser
} = require('../controllers/users')

router.route('/').get(searchUser)
router.route('/:id').delete(deleteUser).patch(updateUser)

module.exports = router
