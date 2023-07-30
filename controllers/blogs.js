const {StatusCodes} = require('http-status-codes')
const Blog = require('../models/blog')
const { ObjectId } = require('mongoose').Types;
const {BadRequestError, NotFoundError} = require('../errors')
const fs = require('fs')
const path = require('path');

const createBlog = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const uploadedImage = req.file;
        const authorID = req.user.id; // from the authentication middleware

        // Process and save the image to the local storage
        const imageFolder = path.join(__dirname, '../public/images');
        fs.mkdir(imageFolder, { recursive: true }, cb => {}); // Create the 'images' folder if it doesn't exist

        const uniqueFilename = Date.now() + '-' + uploadedImage.originalname;
        const imagePath = path.join(imageFolder, uniqueFilename);

        fs.rename(uploadedImage.path, imagePath, (err) => {
            if(err){
                throw err
            }
        }); // Move the uploaded file to the 'images' folder with the unique filename

        // Create a new blog post in the database
        const newBlog = await Blog.create({
            title,
            content,
            tags: [tags],
            imgUrl: imagePath, // Save the image's absolute path and filename in the database
            authorID,
        });
        res.status(StatusCodes.CREATED).json({ blog: newBlog });
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getAllBlogs = async (req, res) => {
    try {
        // Retrieve the last four blogs from the database
        const blogs = await Blog.find().sort({ date: -1 }).limit(4);
        res.status(StatusCodes.OK).json({ blogs });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
    }
}

const getBlog = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid blog ID' });
        }

        // Find the blog by ID in the database
        const blog = await Blog.findById(id);
        // If the blog is not found, return a 404 not found error
        if (!blog) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Blog not found' });
        }

        res.status(StatusCodes.OK).json({ blog });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
    }
}

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags } = req.body;
        const image = req.file;
    
        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid blog ID' });
        }

        // Find the blog by ID in the database
        const blog = await Blog.findById(id);
    
        if (!blog) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Blog not found' });
        }
    
        // Check if the user ID from the token matches the blog's authorID
        const tokenUserId = req.user.id;
        if (blog.authorID.toString() !== tokenUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'You are not authorized to update this blog' });
        }
    
        // Update the blog fields
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.tags = [tags];
    
        // delete old blog image for memory saving
        fs.unlinkSync(blog.imgUrl); // Delete the image file synchronously

        // Update the image if provided
        if (image) {
            // Process and save the image to the local storage
            const imageFolder = path.join(__dirname, '../public/images');
            await fs.mkdir(imageFolder, { recursive: true }, cb => {}); // Create the 'images' folder if it doesn't exist

            const uniqueFilename = Date.now() + '-' + image.originalname;
            const imagePath = path.join(imageFolder, uniqueFilename);

            await fs.rename(image.path, imagePath, (err) => {
                if(err){
                    throw err
                }
            }); // Move the uploaded file to the 'images' folder with the unique filename
            image.path = imagePath

            blog.imgUrl = image.path;
        }
    
        // Update the lastUpdate field with the current date
        blog.lastUpdate = Date.now();
    
        // Save the updated blog to the database
        await blog.save();
    
        res.status(StatusCodes.OK).json({ blog });
    } catch (error) {
        // console.error('Error updating blog:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
    }
}

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid blog ID' });
        }

        // Find the blog by ID in the database
        const blog = await Blog.findById(id);
    
        // If the blog is not found, return a 404 not found error
        if (!blog) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Blog not found' });
        }
    
        // Check if the user ID from the token matches the blog's authorID
        const tokenUserId = req.user.id;
        if (blog.authorID.toString() !== tokenUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'You are not authorized to delete this blog' });
        }
        // Delete the blog image from local storage if it exists
        if (blog.imgUrl) {
            const imagePath = blog.imgUrl
            fs.unlinkSync(imagePath); // Delete the image file synchronously
        }
        // Delete the blog from the database
        await blog.remove();
    
        res.status(StatusCodes.OK).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
    }
}

module.exports = {
    createBlog,
    getAllBlogs,
    getBlog,
    updateBlog,
    deleteBlog
}