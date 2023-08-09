const express = require('express')
const router = express.Router()

const {
    createSponsorsList,
    getSponsorsList,
    deleteSponsorsList,
} = require('../controllers/sponsores')

router.route('/').post(createSponsorsList).get(getSponsorsList).delete(deleteSponsorsList)

module.exports = router
