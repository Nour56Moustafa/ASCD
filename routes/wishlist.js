const express = require('express')
const router = express.Router()
const authentication = require('../middleware/authentication');

const {
    addProductToWishlist,
    addBlogToWishlist,
    getWishlist,
    deleteProductFromWishlist,
    deleteBlogFromWishlist,
    deleteWishlist
} = require('../controllers/wishlist')

router.use(authentication)

router.route('/').get(getWishlist).delete(deleteWishlist)
router.route('/products/:productID').post(addProductToWishlist).delete(deleteProductFromWishlist)
router.route('/blogs/:blogID').post(addBlogToWishlist).delete(deleteBlogFromWishlist)


module.exports = router
