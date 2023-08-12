const { StatusCodes } = require('http-status-codes');
const Statistics = require('../models/statistics');
const { ObjectId } = require('mongoose').Types;

const createStatistic = async (req, res) => {
    try {
        const { name, value, desc } = req.body;

        // Create a new statistic
        const newStatistic = await Statistics.create({
            name,
            value,
            desc
        });

        res.status(StatusCodes.CREATED).json({ message: 'Statistic created successfully', statistic: newStatistic });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getAllStatistics = async (req, res) => {
    try {
        // Fetch all statistics
        const allStatistics = await Statistics.find();

        res.status(StatusCodes.OK).json({ statistics: allStatistics });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const updateStatistic = async (req, res) => {
    try {
        const { statisticID } = req.params;
        const { name, value, desc } = req.body;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(statisticID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid statistic ID' });
        }

        // Find the statistic by ID in the database
        const statistic = await Statistics.findById(statisticID);

        // If the statistic is not found, return a 404 not found error
        if (!statistic) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Statistic not found' });
        }

        // Update the fields if they are provided
        if (name) statistic.name = name;
        if (value) statistic.value = value;
        if (desc) statistic.desc = desc;

        // Save the updated statistic
        await statistic.save();

        res.status(StatusCodes.OK).json({ message: 'Statistic updated successfully', statistic });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteAllStatistics = async (req, res) => {
    try {
        // Delete all statistics entries
        await Statistics.deleteMany();

        res.status(StatusCodes.OK).json({ message: 'All statistics deleted successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteStatistic = async (req, res) => {
    try {
        const { statisticID } = req.params;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(statisticID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid statistic ID' });
        }

        // Find the statistic by ID and delete it
        const deletedStatistic = await Statistics.findByIdAndDelete(statisticID);

        if (!deletedStatistic) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Statistic not found' });
        }

        res.status(StatusCodes.OK).json({ message: 'Statistic deleted successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}


module.exports = {
    createStatistic,
    updateStatistic,
    deleteStatistic,
    deleteAllStatistics,
    getAllStatistics
}