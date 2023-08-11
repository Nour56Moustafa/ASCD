const express = require('express')
const router = express.Router()
const authenticateCompany = require('../middleware/authentication');
const authenticateUser = require('../middleware/authentication');

const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductsByCompany,
    rateProduct
} = require('../controllers/products')

router.route('/').post(authenticateCompany, createProduct).get(getAllProducts)
router.route('/:productID').post(authenticateUser, rateProduct).get(getProduct).delete(authenticateCompany, deleteProduct).patch(authenticateCompany, updateProduct)
router.route('/:companyID/products').get(getProductsByCompany)

module.exports = router
