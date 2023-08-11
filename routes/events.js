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
router.route('/:eventID').post(authenticateUser, bookForEvent).get(getEvent).delete(authenticateUser, isAdmin, deleteEvent).patch(authenticateUser, isAdmin, updateEvent)
router.route('/:userID/events').get(authenticateUser, getEventsByUserId)

module.exports = router

