const express = require('express')
const router = express.Router()

const {
    addToSponsoresList,
    getSponsoresList,
    deleteSponsor,
    changeSponsorType
} = require('../controllers/sponsores')

router.route('/').post(addToSponsoresList).get(getSponsoresList)
router.route('/:id').post(changeSponsorType).delete(deleteSponsor)

module.exports = router
