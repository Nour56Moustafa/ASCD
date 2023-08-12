const {StatusCodes} = require('http-status-codes')
const Event = require('../models/event')
const User = require('../models/user')
const { ObjectId } = require('mongoose').Types;


const createEvent = async (req, res) => {
    try {
        const { name, location, date, time, desc, maxAttendants, instructor, duration } = req.body;

        // Create the event
        const newEvent = await Event.create({
            name,
            location,
            date,
            time,
            desc,
            maxAttendants,
            instructor,
            duration,
        });

        res.status(StatusCodes.CREATED).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();

        res.status(StatusCodes.OK).json({ events });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getEvent = async (req, res) => {
    try {
        const { eventID } = req.params;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(eventID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid event ID' });
        }
        
        // Find the event by ID
        const event = await Event.findById(eventID);

        // If the event is not found, return a 404 not found error
        if (!event) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Event not found' });
        }

        res.status(StatusCodes.OK).json({ event });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const updateEvent = async (req, res) => {
    try {
        const { eventID } = req.params;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(eventID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid event ID' });
        }

        // Find the event by ID
        const event = await Event.findById(eventID);

        // If the event is not found, return a 404 not found error
        if (!event) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Event not found' });
        }

        // Update the event's fields with the new data from req.body
        if (req.body.name) {
            event.name = req.body.name;
        }
        if (req.body.location) {
            event.location = req.body.location;
        }
        if (req.body.date) {
            event.date = req.body.date;
        }
        if (req.body.time) {
            event.time = req.body.time;
        }
        if (req.body.desc) {
            event.desc = req.body.desc;
        }
        if (req.body.maxAttendants) {
            event.maxAttendants = req.body.maxAttendants;
        }
        if (req.body.instructor) {
            event.instructor = req.body.instructor;
        }
        if (req.body.duration) {
            event.duration = req.body.duration;
        }

        // Save the updated event
        await event.save();

        res.status(StatusCodes.OK).json({ message: 'Event updated successfully', event });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteEvent = async (req, res) => {
    try {
        const { eventID } = req.params;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(eventID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid event ID' });
        }

        // Find the event by ID in the database
        const event = await Event.findById(eventID);

        // If the event is not found, return a 404 not found error
        if (!event) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Event not found' });
        }

        // Delete the event
        await event.remove();

        res.status(StatusCodes.OK).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const bookForEvent = async (req, res) => {
    try {
        const { eventID } = req.params;
        const userId = req.user.id;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(eventID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid event ID' });
        }

        // Find the event by ID in the database
        const event = await Event.findById(eventID);

        // If the event is not found, return a 404 not found error
        if (!event) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Event not found' });
        }

        // Find the user by ID in the database
        const user = await User.findById(userId);

        // If the user is not found, return a 404 not found error
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
        }

        // Check if the event has reached maximum attendees
        if (event.attendants >= event.maxAttendants) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Event is already fully booked' });
        }

        // Check if the user has already booked this event
        if (user.reservations.includes(eventID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'You have already booked this event' });
        }

        // Add the event's ID to the user's reservations array
        user.reservations.push(eventID);
        await user.save();

        res.status(StatusCodes.OK).json({ message: 'Event booked successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getEventsByUserId = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user by ID and populate the reservations field with specific fields
        const user = await User.findById(userId).populate({
            path: 'reservations',
            select: '_id name location date time desc instructor duration',
        });

        // If the user is not found, return a 404 not found error
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
        }

        // Extract and send the reservations (booked events) from the user's document
        const reservations = user.reservations;

        res.status(StatusCodes.OK).json({ reservations });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteAllEvents = async (req, res) => {
    try {
        const result = await Event.deleteMany({});
        const deletedCount = result.deletedCount
        res.status(StatusCodes.OK).json({ message: 'Events deleted successfully', deletedCount });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}


module.exports = {
    createEvent,
    getAllEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    getEventsByUserId,
    bookForEvent,
    deleteAllEvents
}