const {StatusCodes} = require('http-status-codes')
// import the model here
const {BadRequestError, NotFoundError} = require('../errors')

const createCompany = async (req, res) => {
    res.send('create company route')
}

const getAllCompanies = async (req, res) => {
    res.send('get all companies route')
}

const getCompany = async (req, res) => {
    res.send('get single company route')
}

const updateCompany = async (req, res) => {
    res.send('update company route')
}

const deleteCompany = async (req, res) => {
    res.send('delete company route')
}


module.exports = {
    createCompany,
    getAllCompanies,
    getCompany,
    updateCompany,
    deleteCompany
}