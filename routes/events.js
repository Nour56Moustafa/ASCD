const express = require('express')
const router = express.Router()
const isAdmin = require('../middleware/is-admin')
const authenticateUser = require('../middleware/authentication')

const {
    createEvent,
    getAllEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    getEventsByUserId,
    bookForEvent
} = require('../controllers/events')

router.route('/').post(authenticateUser, isAdmin, createEvent).get(getAllEvents)
router.route('/reservations').get(authenticateUser, getEventsByUserId)
router.route('/:eventID').post(authenticateUser, bookForEvent).get(getEvent).delete(authenticateUser, isAdmin, deleteEvent).patch( updateEvent)

module.exports = router

