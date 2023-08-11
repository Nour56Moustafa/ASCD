const { StatusCodes } = require('http-status-codes')
const Blog = require('../models/blog')
const User = require('../models/user')
const { ObjectId } = require('mongoose').Types;
const fs = require('fs')
const path = require('path');

const createBlog = async(req, res) => {
    try {
        const { title, content, tags } = req.body;
        const uploadedImage = req.files[0];
        const authorID = req.user.id; // from the authentication middleware

        // limit the image size up to 5 MB
        if (uploadedImage.size > 5242880) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'File is too large to be uploaded, choose another file and try again' });
        }

        // Process and save the image to the local storage
        const imageFolder = path.join(__dirname, '../public/images');
        fs.mkdir(imageFolder, { recursive: true }, cb => {}); // Create the 'images' folder if it doesn't exist

        const uniqueFilename = Date.now() + '-' + uploadedImage.originalname;
        const imagePath = path.join(imageFolder, uniqueFilename);

        fs.rename(uploadedImage.path, imagePath, (err) => {
            if (err) {
                throw err
            }
        }); // Move the uploaded file to the 'images' folder with the unique filename

        // Create a new blog post in the database
        const newBlog = await Blog.create({
            title,
            content,
            tags: tags.split(',').map(tag => tag.trim()),
            imgUrl: imagePath, // Save the image's absolute path and filename in the database
            authorID,
        });
        res.status(StatusCodes.CREATED).json({ blog: newBlog });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

const getAllBlogs = async(req, res) => {
    try {
        // Retrieve the last four blogs from the database
        const blogs = await Blog.find().sort({ date: -1 }).limit(4);
        res.status(StatusCodes.OK).json({ blogs });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
    }
}

const getBlog = async(req, res) => {
    try {
        const { blogID } = req.params;
        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(blogID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid blog ID' });
        }

        // Find the blog by ID in the database
        const blog = await Blog.findById(blogID);
        // If the blog is not found, return a 404 not found error
        if (!blog) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Blog not found' });
        }

        res.status(StatusCodes.OK).json({ blog });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
    }
}

const updateBlog = async(req, res) => {
    try {
        const { blogID } = req.params;
        const { title, content, tags } = req.body;
        const image = req.files[0];

        // limit the image size up to 5 MB
        if (image.size > 5242880) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'File is too large to be uploaded, choose another file and try again' });
        }

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(blogID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid blog ID' });
        }

        // Find the blog by ID in the database
        const blog = await Blog.findById(blogID);

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
        if(tags){
            blog.tags = tags.split(',').map(tag => tag.trim())
        }

        // Update the image if provided
        if (image) {
            // delete old blog image for memory saving
            fs.unlinkSync(blog.imgUrl); // Delete the image file synchronously

            // Process and save the image to the local storage
            const imageFolder = path.join(__dirname, '../public/images');
            await fs.mkdir(imageFolder, { recursive: true }, cb => {}); // Create the 'images' folder if it doesn't exist

            const uniqueFilename = Date.now() + '-' + image.originalname;
            const imagePath = path.join(imageFolder, uniqueFilename);

            await fs.rename(image.path, imagePath, (err) => {
                if (err) {
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
    }
}

const deleteBlog = async(req, res) => {
    try {
        const { blogID } = req.params;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(blogID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid blog ID' });
        }

        // Find the blog by ID in the database
        const blog = await Blog.findById(blogID);

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

const manageLikes = async(req, res) => {
    try {
        const { blogID } = req.params;

        // Check if the provided ID is a valid ObjectId
        if (!ObjectId.isValid(blogID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid blog ID' });
        }

        // Find the blog by ID in the database
        const blog = await Blog.findById(blogID);

        // If the blog is not found, return a 404 not found error
        if (!blog) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Blog not found' });
        }

        // Check if the user ID from the token (req.user.id) is in the likes array of the User model
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Log in and try again' });
        }

        if (user.likes.includes(blogID)) {
            // Remove the blog's ID from the 'likes' array in the User model
            const blogIndex = user.likes.indexOf(blogID);
            user.likes.splice(blogIndex, 1);
            await user.save();

            // Decrement likes count field in the Blog model by one
            blog.likesCount = blog.likesCount - 1
            await blog.save();
            res.status(StatusCodes.OK).json({ message: 'Blog unliked successfully' });
        } else {
            // Add the blog's ID to the 'likes' array in the User model
            user.likes.push(blogID);
            await user.save();

            // Increment likes count field in the Blog model by one
            blog.likesCount = blog.likesCount + 1
            await blog.save();

            res.status(StatusCodes.OK).json({ message: 'Blog liked successfully' });
        }

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
    }
}

const getLikedBlogs = async(req, res) => {
    try {
        const userId = req.user.id;

        // Find the user by ID
        const user = await User.findById(userId);

        // If the user is not found, return an error
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
        }

        // Get the liked blogs IDs from the user
        const likedBlogIds = user.likes;

        // Find the liked blogs based on the likedBlogIds array
        const likedBlogs = await Blog.find({ _id: { $in: likedBlogIds } });

        // Return the liked blogs array
        res.status(StatusCodes.OK).json({ likedBlogs });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
}

module.exports = {
    createBlog,
    getAllBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    manageLikes,
    getLikedBlogs,
}