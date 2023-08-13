const {StatusCodes} = require('http-status-codes')
const { ObjectId } = require('mongoose').Types;
const Product = require('../models/product')
const ProductCart = require('../models/productCart')


const addToCart = async (req, res) => {
    try {
        const { productID } = req.params;
        const { quantity } = req.body
        const userId = req.user.id;

        // Check if the provided product ID is a valid ObjectId
        if (!ObjectId.isValid(productID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid product ID' });
        }

        // Check if the user is authenticated
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Please sign in to add products to your cart' });
        }

        // Check if the product exists
        const product = await Product.findById(productID);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
        }

        // Check if the user already has the product in their cart
        const existingCartItem = await ProductCart.findOne({ productID: productID, userID: userId });
        if (existingCartItem) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Product already in cart' });
        }

        // Create a new cart item
        const newCartItem = await ProductCart.create({
            productID: productID,
            userID: userId,
            quantity: quantity,
        });
        
        res.status(StatusCodes.CREATED).json({ message: 'Product added to cart successfully', cartItem: newCartItem });
    } catch (error) {
        console.log (error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if the user is authenticated
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Please sign in to view your cart' });
        }

        // Find cart items for the user
        const cartItems = await ProductCart.find({ userID: userId }).populate('productID');

        res.status(StatusCodes.OK).json({ cartItems });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productID } = req.params;

        // Check if the user is authenticated
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Please sign in to delete products from your cart' });
        }

        // Check if the provided product ID is a valid ObjectId
        if (!ObjectId.isValid(productID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid product ID' });
        }
        
        // Delete the cart item associated with the user and product
        await ProductCart.findOneAndDelete({ userID: userId, productID: productID });

        res.status(StatusCodes.OK).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if the user is authenticated
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Please sign in to delete products from your cart' });
        }
        
        // Delete all cart items associated with the user
        await ProductCart.deleteMany({ userID: userId });

        res.status(StatusCodes.OK).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}


module.exports = {
    addToCart,
    getCart,
    deleteFromCart,
    deleteCart
}