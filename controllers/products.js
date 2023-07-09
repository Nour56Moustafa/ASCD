const {StatusCodes} = require('http-status-codes')
// import the model here
const {BadRequestError, NotFoundError} = require('../errors')

const createProduct = async (req, res) => {
    res.send('create product route')
}

const getAllProducts = async (req, res) => {
    res.send('get all products route')
}

const getProduct = async (req, res) => {
    res.send('get single product route')
}

const updateProduct = async (req, res) => {
    res.send('update product route')
}

const deleteProduct = async (req, res) => {
    res.send('delete product route')
}


module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct
}