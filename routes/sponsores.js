const express = require('express')
const router = express.Router()
const isAdmin = require('../middleware/is-admin')

const {
    createSponsorsList,
    getSponsorsList,
    deleteSponsorsList,
} = require('../controllers/sponsores')

router.use(isAdmin)
router.route('/').post(createSponsorsList).get(getSponsorsList).delete(deleteSponsorsList)

module.exports = router
