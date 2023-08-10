const {StatusCodes} = require('http-status-codes')
const Product = require('../models/product')
const Company = require('../models/company')
const { ObjectId } = require('mongoose').Types;
const fs = require('fs')
const path = require('path');
const {BadRequestError, NotFoundError} = require('../errors')

const createProduct = async (req, res) => {
    try {
        const { name, manufacturerCompany, price, priceOnSale, type, guarantee, colors, sizes } = req.body;
        const productImages = req.files
        const relatedCompany = req.company._id
        const flag = false
        // Check if the user is authenticated as a company
        if (!relatedCompany) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'You are not authorized to create a product' });
        }
        
        for (const productImage of productImages) {
            // limit the image size up to 5 MB
            if(productImage.size > 5242880){
                res.status(StatusCodes.BAD_REQUEST).json({ error: 'File is too large to be uploaded, choose another file and try again' });
                flag = true
                break;
            }

            // Process and save the image to the local storage
            const imageFolder = path.join(__dirname, '../public/images');
            fs.mkdir(imageFolder, { recursive: true }, cb => {}); // Create the 'images' folder if it doesn't exist

            const uniqueFilename = Date.now() + '-' + productImage.originalname;
            const imagePath = path.join(imageFolder, uniqueFilename);

            fs.rename(productImage.path, imagePath, (err) => {
                if(err){
                    throw err
                }
            }); // Move the uploaded file to the 'images' folder with the unique filename
        }
        const pathsArray = productImages.map(image => image.path);
        
        if (!flag) {
            // Create the product
            const newProduct = await Product.create({
                name,
                relatedCompany: relatedCompany,
                manufacturerCompany,
                price,
                priceOnSale,
                type,
                guarantee,
                colors: colors.split(',').map(color => color.trim()),
                sizes: sizes.split(',').map(size => size.trim()),
                imgUrls: pathsArray,
            });

            res.status(StatusCodes.CREATED).json({ message: 'Product created successfully', product: newProduct });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(StatusCodes.OK).json({ products });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(productId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid product ID' });
        }

        const product = await Product.findById(productId).populate('relatedCompany', 'name origin branches accounts desc profileimgUrl companyimgUrl');

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
        }

        res.status(StatusCodes.OK).json({ product });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, manufacturerCompany, price, priceOnSale, type, guarantee, colors, sizes } = req.body;
        const productImages = req.files;
        const relatedCompany = req.company._id;
        const flag = false;

        // Check if the user is authenticated as a company
        if (!relatedCompany) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'You are not authorized to update this product' });
        }

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(productId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid product ID' });
        }

        // Find the product by ID
        const product = await Product.findById(productId);

        // Check if the product exists
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
        }

        // Check if the relatedCompany matches the product's relatedCompany
        if (!product.relatedCompany.equals(relatedCompany)) {
            return res.status(StatusCodes.FORBIDDEN).json({ error: 'You are not authorized to update this product' });
        }

        if (productImages){
            for (const imagePath of product.imgUrls){
                // delete old product images for memory saving
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(`Error deleting image: ${err}`);
                    }
                });
            }
            // Continue with the update process
            for (const productImage of productImages) {
                // limit the image size up to 5 MB
                if (productImage.size > 5242880) {
                    res.status(StatusCodes.BAD_REQUEST).json({ error: 'File is too large to be uploaded, choose another file and try again' });
                    flag = true;
                    break;
                }

                // Process and save the image to the local storage
                const imageFolder = path.join(__dirname, '../public/images');
                fs.mkdir(imageFolder, { recursive: true }, cb => {}); // Create the 'images' folder if it doesn't exist

                const uniqueFilename = Date.now() + '-' + productImage.originalname;
                const imagePath = path.join(imageFolder, uniqueFilename);

                fs.rename(productImage.path, imagePath, (err) => {
                    if (err) {
                        throw err;
                    }
                }); // Move the uploaded file to the 'images' folder with the unique filename
            }
        }
        const pathsArray = productImages.map(image => image.path);

        if (!flag) {
            // Update the product
            product.name = name || product.name;
            product.manufacturerCompany = manufacturerCompany || product.manufacturerCompany;
            product.price = price || product.price;
            product.priceOnSale = priceOnSale || product.priceOnSale;
            product.type = type || product.type;
            product.guarantee = guarantee || product.guarantee;
            product.colors = colors.split(',').map(color => color.trim()) || product.colors;
            product.sizes = sizes.split(',').map(size => size.trim()) || product.sizes;
            product.imgUrls = pathsArray || product.imgUrls;

            await product.save();

            res.status(StatusCodes.OK).json({ message: 'Product updated successfully', product });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const relatedCompany = req.company._id;

        // Check if the user is authenticated as a company
        if (!relatedCompany) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'You are not authorized to delete this product' });
        }

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(productId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid product ID' });
        }

        // Find the product by ID
        const product = await Product.findById(productId);

        // Check if the product exists
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
        }

        // Check if the relatedCompany matches the product's relatedCompany
        if (!product.relatedCompany.equals(relatedCompany)) {
            return res.status(StatusCodes.FORBIDDEN).json({ error: 'You are not authorized to delete this product' });
        }

        // Delete the product and associated images
        for (const imagePath of product.imgUrl) {
            fs.unlink(imageFullPath, (err) => {
                if (err) {
                    console.error(`Error deleting image: ${err}`);
                }
            });
        }

        await product.remove();

        res.status(StatusCodes.OK).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getProductsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(companyId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid company ID' });
        }

        // Find the company by ID
        const company = await Company.findById(companyId);

        // Check if the company exists
        if (!company) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Company not found' });
        }

        // Find all products associated with the company
        const products = await Product.find({ relatedCompany: companyId });

        res.status(StatusCodes.OK).json({ products });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
};

const rateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rate } = req.body;
        
        if (req.company) {
            return res.status(StatusCodes.FORBIDDEN).json({ error: 'A company can not rate products' });
        }

        if (!req.user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Please sign in to rate products' });
        }

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(productId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid product ID' });
        }

        // Find the product by ID
        const product = await Product.findById(productId);

        // Check if the product exists
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
        }

        // Update the product's numRating and rate fields
        const newNumRating = product.numRating + 1;
        const newTotalRate = product.rate * product.numRating + rate;
        const newAverageRate = newTotalRate / newNumRating;

        product.numRating = newNumRating;
        product.rate = newAverageRate;

        // Save the updated product
        await product.save();

        res.status(StatusCodes.OK).json({ message: 'Product rated successfully', product });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductsByCompany,
    rateProduct
}