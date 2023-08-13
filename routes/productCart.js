const express = require('express')
const router = express.Router()
const authentication = require('../middleware/authentication');

const {
    addToCart,
    getCart,
    deleteFromCart,
    deleteCart
} = require('../controllers/productCart')

router.use(authentication)

router.route('/').get(getCart).delete(deleteCart)
router.route('/:productID').post(addToCart).delete(deleteFromCart)


module.exports = router
