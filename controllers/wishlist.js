const {StatusCodes} = require('http-status-codes')
const { ObjectId } = require('mongoose').Types;
const User = require('../models/user')


const addProductToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productID } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Please sign in and try again' });
        }

        // Check if the provided product ID is a valid ObjectId
        if (!ObjectId.isValid(productID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid product ID' });
        }

        if (user.favProducts.includes(productID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Product is already in the wishlist' });
        }

        user.favProducts.push(productID);
        await user.save();

        res.status(StatusCodes.OK).json({ message: 'Product added to wishlist successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const addBlogToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { blogID } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Please sign in and try again' });
        }

        // Check if the provided product ID is a valid ObjectId
        if (!ObjectId.isValid(blogID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid blog ID' });
        }

        if (user.favBlogs.includes(blogID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Blog is already in the wishlist' });
        }

        user.favBlogs.push(blogID);
        await user.save();

        res.status(StatusCodes.OK).json({ message: 'Blog added to wishlist successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate('favProducts favBlogs');

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Please sign in and try again' });
        }

        const wishlist = {
            favProducts: user.favProducts,
            favBlogs: user.favBlogs,
        };

        res.status(StatusCodes.OK).json(wishlist);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteProductFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productID } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Please sign in and try again' });
        }

        // Check if the provided product ID is a valid ObjectId
        if (!ObjectId.isValid(productID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid product ID' });
        }

        if (!user.favProducts.includes(productID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Product is not in the wishlist' });
        }

        // Remove the product from the array
        user.favProducts = user.favProducts.filter(id => id.toString() !== productID);
        await user.save();

        res.status(StatusCodes.OK).json({ message: 'Product removed from wishlist successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteBlogFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { blogID } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Please sign in and try again' });
        }

        // Check if the provided product ID is a valid ObjectId
        if (!ObjectId.isValid(blogID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid blog ID' });
        }

        if (!user.favBlogs.includes(blogID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Blog is not in the wishlist' });
        }

        // Remove the product from the array
        user.favBlogs = user.favBlogs.filter(id => id.toString() !== blogID);
        await user.save();

        res.status(StatusCodes.OK).json({ message: 'Blog removed from wishlist successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(userId, {
            $set: { favProducts: [], favBlogs: [] },
        });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Please sign in and try again' });
        }

        res.status(StatusCodes.OK).json({ message: 'Wishlist cleared successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}


module.exports = {
    addProductToWishlist,
    addBlogToWishlist,
    getWishlist,
    deleteProductFromWishlist,
    deleteBlogFromWishlist,
    deleteWishlist
}