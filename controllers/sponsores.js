const {StatusCodes} = require('http-status-codes')
const Sponsor = require('../models/sponsor')
const Company = require('../models/company')
const { ObjectId } = require('mongoose').Types;

const createSponsorsList = async (req, res) => {
    try {
        const { diamondId, goldenId, silverId } = req.body;

        // Check if the provided IDs are valid ObjectIds
        if (!ObjectId.isValid(diamondId) || !ObjectId.isValid(goldenId) || !ObjectId.isValid(silverId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid company ID(s)' });
        }

        // Find the companies by their IDs in the Company model
        const diamondCompany = await Company.findById(diamondId);
        const goldenCompany = await Company.findById(goldenId);
        const silverCompany = await Company.findById(silverId);

        if (!diamondCompany || !goldenCompany || !silverCompany) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'One or more companies not found' });
        }

        // Create sponsor records in the Sponsor model
        const sponsors = [
            { type: 'diamond', companyID: diamondCompany._id },
            { type: 'golden', companyID: goldenCompany._id },
            { type: 'silver', companyID: silverCompany._id },
        ];
        const createdSponsors = await Sponsor.create(sponsors);

        res.status(StatusCodes.CREATED).json({ message: 'Sponsor list created successfully', sponsors: createdSponsors });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getSponsorsList = async (req, res) => {
    try {
        const sponsors = await Sponsor.find().populate('companyID', 'name origin branches accounts desc profileImgUrl companyImgUrl')

        if (!sponsors.length) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Sponsor list is empty' });
        }

        res.status(StatusCodes.OK).json({ sponsors });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteSponsorsList = async (req, res) => {
    try {
        // Delete all documents in the Sponsor collection
        await Sponsor.deleteMany();

        res.status(StatusCodes.OK).json({ message: 'Sponsors list deleted successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

module.exports = {
    createSponsorsList,
    getSponsorsList,
    deleteSponsorsList,
}