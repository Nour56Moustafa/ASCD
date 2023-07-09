const {StatusCodes} = require('http-status-codes')
// import the model here
const {BadRequestError, NotFoundError} = require('../errors')

const addToSponsoresList = async (req, res) => {
    res.send('create sponsores list route')
}

const getSponsoresList = async (req, res) => {
    res.send('get sponsores list route')
}

const deleteSponsor = async (req, res) => {
    res.send('delete sponsor route')
}

const changeSponsorType = async (req, res) => {
    res.send(`change sponsor's type route`)
}


module.exports = {
    addToSponsoresList,
    getSponsoresList,
    deleteSponsor,
    changeSponsorType
}