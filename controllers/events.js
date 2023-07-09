const {StatusCodes} = require('http-status-codes')
// import the model here
const {BadRequestError, NotFoundError} = require('../errors')

const createEvent = async (req, res) => {
    res.send('create event route')
}

const getAllEvents = async (req, res) => {
    res.send('get all events route')
}

const getEvent = async (req, res) => {
    res.send('get single event route')
}

const updateEvent = async (req, res) => {
    res.send('update event route')
}

const deleteEvent = async (req, res) => {
    res.send('delete event route')
}


module.exports = {
    createEvent,
    getAllEvents,
    getEvent,
    updateEvent,
    deleteEvent
}